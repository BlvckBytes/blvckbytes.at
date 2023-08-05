# Binomial Expansion

A `Binomial` is a special case of a `Polynomial` which contains exactly two (bi) `Monomials`. A `Monomial` is a mathematical expression which only consists of coefficients, powers, variables and constants.

If such a Binomial is raised to a power `n`, the result is called a Binomial Expansion.

## Statement

For $n \in \mathbb{N}$, $(a+b)^n=\sum_{k=0}^{n} \binom{n}{k}*a^{(n-k)}*b^{k}$

This notation describes that for any given $n$ out of the set of natural numbers (1, 2, 3, ...), the monomials $a$ plus $b$, all raised to the power of $n$ equal the sum of $n$ terms, where each term is following a common pattern: The binomial coefficient $\binom{n}{k}$ multiplied by $a$ to the power of $n$ minus the current terms index, multiplied by $b$ to the power of the current terms index.

Simply put, this causes (read left to right) the powers of $a$ to start at $n$ and decrement by one each time, while $b$ starts at zero (equals to one and can be omitted) and increments by one each time.

$(a+b)^5=\binom{n}{k}*a^5*b^0 + \binom{n}{k}*a^4*b^1 + \binom{n}{k}*a^3*b^2 + \binom{n}{k}*a^2*b^3 + \binom{n}{k}*a^1*b^4 + \binom{n}{k}*a^0*b^5$

Due to the fact that both $a$ and $b$'s exponents always have to add up to $n$ and due to the symmetry of the binomial coefficient, the powers of $a$ and $b$ are interchangable.

Example for $n=3$, where $|$ marks the symmetry line:

a,b: $(3, 0), (2, 1)|(1, 2), (0, 3)$
<br>
b,a: $(0, 3), (1, 2)|(2, 1), (3, 0)$

Thus, the following equation is true:

$\sum_{k=0}^{n} \binom{n}{k}*a^{(n-k)}*b^{k} = \sum_{k=0}^{n} \binom{n}{k}*a^{k}*b^{(n-k)}$

## Counting Monomials

The binomial coefficient $\binom{n}{k}$ (spoken "n choose k") represents the number of possibilities to choose a combination of $k$ elements out of a pool of $n$ elements, ignoring the order of those chosen elements.

Why can the order be ignored? Because the multiplication operation is commutative, meaning that it's operands can be swapped without changing the result.

$5*3*2=3*2*5=5*2*3=30$

To figure out the binomial coefficient of a term, the question to ask is: How often does this combination of elements occur when I multiply all binomials together?

Since $(a+b)^3=(a+b)*(a+b)*(a+b)$, more generally written as $(a+b)^n=\prod_{k=0}^{n}(a+b)$ for $n \in \mathbb{N}$, you just multiply the terms out over and over again. Let's go with the power of three as a concise example:

$(a+b)^3=(a+b)*(a+b)*(a+b)$
<br>
$(a+b)^3=(a*a + b*a + a*b + b*b)*(a+b)$
<br>
$(a+b)^3=a*a*a + a*a*b + b*a*a + b*a*b + a*b*a + a*b*b + b*b*a + b*b*b$

Collecting reoccurring multiplications into powers and sorting alphabetically:

$(a+b)^3= a^3 + a^2*b + a^2*b + a*b^2 + a^2*b + a*b^2 + a*b^2 + b^3$

Collecting reoccurring monomials into occurrence-counting factors:

$(a+b)^3= 1*a^3 + 3*a^2*b + 3*a*b^2 + 1*b^3$

So the binomial coefficients depict - as stated previously - how many possibilities there are to pick these combinations of powers, as in: How often does $a^3$, $a^2*b$, $a*b^2$ or $b^3$ occur?

## Combinatorics View

When viewed from a combinatorics standpoint, the question of "How often does this monomial occur" becomes really simple.

$(a+b)^3=(a+b)*(a+b)*(a+b)$

Imagine an extrapolated version of the FOIL Method (**F**irst, **O**uter, **I**nner, **L**ast), starting at at the left hand side of the multiplication, picking the first monomial and then bouncing to the first of the second operand, finally the first of the last operand. Write down this combination. Next up, don't go to the first monomial of the last operand, but to the next in line. Once an operand's choice of monomials has been exhausted, advance to the previous monomial in line.

(Operand: $(a+b)$, Operation: $*$, Monomial: $a$, $b$)

If you keep doing this, you'll end up with all possible combinations of $a$ and $b$. These sets always have as many members as the size of the power the binomial was raised to. In this case, the list is as follows:

$(aaa), (aab), (aba), (abb), (baa), (bab), (bba), (bbb)$

Since **strictly all** operand's monomials are multiplied together, $a$ is multiplied by itself $n$ times once, so is $b$, and all combinations (ignoring order) in between also occur **at least twice** (due to the symmetry of FOILing).

So, $a^n$ and $b^n$ always have $1$ as a coefficient. For the example of $n = 3$, the coefficients can be determined as followed:

$a^2*b$ How often can I pick 2 $a$s out of three $a$s? $\binom{3}{2}$
<br>
$a*b^2$ How often can I pick one $a$ out of three $a$s? $\binom{3}{1}$

If two $a$s are picked, the remaining empty slots are always filled up with the opposite, $b$, as there are no combinations of size $<n$. Asking for how often $b$ can be picked is fine as well due to the symmetry of the binomial coefficient, as stated earlier.

## Binomial Coefficient

How can a function be defined, that returns the number of possibilities to choose a combination of $k$ elements out of a pool of $n$ elements?

Let's start out with all possible combinations within the pool itself: $n!$.

Example: $n=5$, pool: $(A, B, C, D, E)$

First choice: 5 options available $(A, B, C, D, E)$, took $B$<br>
Second choice: 4 options available $(A, C, D, E)$, took $E$<br>
Third choice: 3 options available $(A, C, D)$, took $A$<br>
Fourth choice: 2 options available $(C, D)$, took $D$<br>
Fith choice: 1 option available $(C)$, took $C$

After taking out $B$, there are four more choices, making up four more combinations. If another element, other than $B$, was taken, there would be a whole other row of combinations ahead. Since order is not *yet* ignored ($(A, B)$ vs $(B, A)$, for example), the total number of possible outcomes is $5*4*3*2*1$, the number of choices at each stage, all multiplied together, because each branch offers a new range of choices. That's $5!$, because of how the factorial is defined.

Let's add a limit to how many elements are choosen ($k$), as the pool is not always to be exhausted completely. Only the first $k$ multiplication operands of $n!$ should remain.

$\frac{n!}{(n-k)!}$

By dividing with $(n-k)!$, the last $(n-k)$ unused operands are cancelled out.

Example: $n=5$, $k=3$, so there are two unused operands.

$\frac{5!}{(5-3)!} = \frac{5!}{2!} = \frac{5*4*3*2*1}{2*1} = 5*4*3$

Only one last adaption remains to end up at the binomial coefficient $\binom{n}{k}$: ignoring the order of chosen elements.

If one chooses $k$ elements, then there are $k!$ permutations possible.

Example: $k=3$, pool: $(A, B, C)$, $k! = 3! = 3*2*1 = 6$

Available permutations:

$(A, B, C)$<br>
$(A, C, B)$<br>
$(B, C, A)$<br>
$(B, A, C)$<br>
$(C, B, A)$<br>
$(C, A, B)$<br>

In order to count all six of these as just one possibility (since the multiplication operation is commutative), the previously derived formula is divided by this number of available permutations, to again cancel more unwanted options out, arriving at the final result:

$\binom{n}{k} = \frac{n!}{(n-k)! * k!}$

To prove this function's symmetry as in $\binom{n}{k}$ and $\binom{n}{(n-k)}$ are equal, the equation just has to be checked for equality.

$\binom{n}{k} = \binom{n}{(n-k)}$

Substitute $(n-k)$ for $k$ on the RHS:

$\frac{n!}{(n-k)!*k!} = \frac{n!}{(n-(n-k))!*(n-k)!}$

Solve:

$\frac{n!}{(n-k)!*k!} = \frac{n!}{(n-(n-k))!*(n-k)!}$<br>
$\frac{n!}{(n-k)!*k!} = \frac{n!}{(n-n+k)!*(n-k)!}$<br>
$\frac{n!}{(n-k)!*k!} = \frac{n!}{k!*(n-k)!}$<br>

True statement, thus this function is symmetrical around $(n-k)$.
