import { Token, Tokens } from 'marked'

const patchTokenArrayRange = (tokens: Token[], start: number, end: number) => {
  for (let i = start; i <= end; ++i) {
    const token = tokens[i];
    token.type = 'text';
    (token as any)['text'] = token.raw;

    // Make sure that the renderer doesn't falsly interpret this token,
    // since a type 'text' object doesn't have sub-tokens
    delete (token as any)['tokens'];
  }
}

const forEachTokenList = (token: Token, receiver: (subTokens: Token[]) => void) => {
  const tokensOnToken = (token as any)['tokens']

  // This takes care of all the simple tokens which have the token array
  // right at the root element, while others may have a more complex structure
  if (tokensOnToken) {
    receiver(tokensOnToken as Token[]);
    return;
  }

  if (token.type == 'table') {
    for (const headerCell of (token as Tokens.Table).header) {
      receiver(headerCell.tokens);
    }

    for (const tableRow of (token as Tokens.Table).rows) {
      for (const rowCell of tableRow) {
        receiver(rowCell.tokens)
      }
    }

    return;
  }

  if (token.type == 'list') {
    for (let item of (token as Tokens.List).items) {
      receiver(item.tokens);
    }
    return;
  }

  if (token.type == 'text') {
    const textTokens = (token as Tokens.Text).tokens;

    if (textTokens)
      receiver(textTokens);

    return;
  }
}

export const patchingTokenWalker = (token: Token) => {
  let tokenAccumulator: Token[] = [];

  forEachTokenList(token, tokens => {
    tokenAccumulator = tokenAccumulator.concat(tokens);
  })

  if (tokenAccumulator.length == 0)
    return;

  let isDoubleDollar = false;
  let lastTexBeginTokenIndex: number | null = null;
  let awaitingClosingSequence = false;

  for (let tokenIndex = 0; tokenIndex < tokenAccumulator.length; ++tokenIndex) {
    const token = tokenAccumulator[tokenIndex];
    const tokenLength = token.raw.length;

    let previousLastTexBeginTokenIndex = lastTexBeginTokenIndex;
    let didContainTex = false;

    for (let charIndex = 0; charIndex < tokenLength; ++charIndex) {
      const char = token.raw[charIndex];

      if (char != '$')
        continue;

      const isEscaped = charIndex != 0 && token.raw[charIndex - 1] == '\\';

      if (isEscaped)
        continue;

      didContainTex = true;

      const nextChar = charIndex == tokenLength - 1 ? null : token.raw[charIndex + 1];
      const isCurrentDoubleDollar = nextChar == '$';

      // Skip over the second dollar, as to not falsly detect a sequence close
      if (isCurrentDoubleDollar)
        ++charIndex;

      if (!awaitingClosingSequence) {
        if (lastTexBeginTokenIndex == null)
          lastTexBeginTokenIndex = tokenIndex;

        isDoubleDollar = isCurrentDoubleDollar;
        awaitingClosingSequence = true;
        continue;
      }

      if (isDoubleDollar && !isCurrentDoubleDollar) {
        console.error(`Expected double dollar ending in ${token.raw} at position ${charIndex + 1}`);
        return;
      }

      if (!isDoubleDollar && isCurrentDoubleDollar) {
        console.error(`Expected single dollar ending in ${token.raw} at position ${charIndex + 1}`);
        return;
      }

      awaitingClosingSequence = false;
    }

    if (!awaitingClosingSequence) {
      // A previous token missed a closing sequence, which has now been found. Patch begin, end,
      // and everything inbetween (em's, etc.)
      if (previousLastTexBeginTokenIndex != null) {
        patchTokenArrayRange(tokenAccumulator, previousLastTexBeginTokenIndex, tokenIndex);
        lastTexBeginTokenIndex = null;
      }
      
      // This one token did contain a full TeX expression, patch it individually, just to make sure.
      else if (didContainTex) {
        patchTokenArrayRange(tokenAccumulator, tokenIndex, tokenIndex);
        lastTexBeginTokenIndex = null;
      }
    }

    else {
      // Last token, yet still missing a close sequence
      if (tokenIndex == tokenAccumulator.length - 1) {
        console.error(`Missed TeX-${isDoubleDollar ? "$$" : "$"} close in or before "${token.raw}"`);
        return;
      }
    }
  }
};