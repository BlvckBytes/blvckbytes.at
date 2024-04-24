## Table Of Contents {: #toc }

## Introduction

WARNING: The original source of information remains at the works of John Gabriel. The likelihood of me misinterpreting his ideas or making mistakes is non-negligible and thereby I cannot **yet** vouch for my representation. As Schopenhauer perfectly put it: once information has passed through another mind, it has been distorted; always consult the author's own works.

INFO: Explanations may be written in my own words, be copies of how John expressed them, or be a mixture of both. I tend to have to work through information by copying and understanding it at first, until I can confidently try to explain it in my own words, which is my ultimate goal. Also, by working through the subject, I collect my own ASCII-files, containing texts, links, and TeX-expressions, which I need for the final portrayal in any case.

This page tries to accumulate knowledge about a mathematical concept revealed by John Gabriel (<a href="https://independent.academia.edu/JohnGabriel30" target="_blank">academia.edu</a>, <a href="https://www.youtube.com/@NewCalculus" target="_blank">YouTube</a>, <a href="https://thenewcalculus.weebly.com" target="_blank">homepage</a>), called <a href="https://www.academia.edu/41616655/An_Introduction_to_the_Single_Variable_New_Calculus" target="_blank">New Calculus</a>, which is <a href="https://drive.google.com/file/d/1t6h3NX3yWft3VTONoDHqfccmapJ5ewop" target="_blank">Not Just A Tautology</a>. In essence, this concept represents a truly rigorous derivation of the derivative (slope of a tangent line on a smooth curve at a point) as well as the integral (area bounded by a smooth curve and the x-axis), all while abstaining from limit theory, infinity, infinitesimals or other made-up theories. The missing link between these two operations has also been unveiled, all while only building upon the work of Euclid's <a href="https://farside.ph.utexas.edu/books/Euclid/Elements.pdf" target="_blank">The Elements</a> and the <a href="https://oll-resources.s3.us-east-2.amazonaws.com/oll3/store/titles/1828/Archimedes_Works1332.pdf" target="_blank">The Works Of Archimedes</a>, and thereby sound geometric knowledge.

Besides making broadly accessible what has been overcomplicated by academia for dozens of decades, John also provides further insight into concepts such as <a href="https://www.academia.edu/105399167/The_Ultimate_Book_of_Numbers" target="_blank">Measure And Number</a>, the <a href="https://www.academia.edu/101865814/Trigonometry_and_its_origins" target="_blank">Origin Of Trigonometry</a>, the <a href="https://www.academia.edu/77923497/The_Mean_Value_Theorem_explained_using_positional_derivatives" target="_blank">Mean Value Theorem</a>, the <a href="https://www.academia.edu/102530388/Symmetry_of_the_circle_defines_four_basic_arithmetic_operations_x_" target="_blank">Definition Of Arithmetic Operations</a>, <a href="https://www.academia.edu/39981684/Proof_of_the_most_important_Number_theorem_that_mainstream_mathematics_academics_never_learned" href="_blank">Expressing Magnitudes In A Radix System</a>, <a href="https://www.academia.edu/45567545/There_are_no_postulates_or_axioms_in_Greek_mathematics" target="_blank">Rejecting Postulates Or Axioms</a>, <a href="https://www.academia.edu/106488069/The_Non_fictional_Origins_and_History_of_Calculus" target="_blank">The Non-Fictional Origins And History Of Calculus</a> and many, many more. Thereby, I strongly believe that the only right thing I can do on my part is to study his work and help to make it attainable, approachable and fully penetrable for other newcomers.

This process will take time and patience, and is not as easy as I'd like it to be without tools like [Arcadia](/philosophy/project-arcadia) or [Tagnet](/philosophy/connecting-minorities#solution-proposal). Still, important groundwork is to be done, so that I fully grasp these concepts and can thereby attain the potential of explaining them to others, which I currently do not possess. Thus follows, that this page is always a "Work In Progress" and will be constantly updated and extended. At the moment, it just represents an extension of my mind, and is thereby just as big of a mess, ;).

## Definitions

### Continousness

A function is continuous over a given interval if there are no disjoint paths in that interval or if it is defined everywhere in that interval. A path is a distance between two points which can be systematically described.

### Smoothness

A function is smooth over a given interval if it is [continuous](#definitions-continousness) over that interval **and** only one tangent line is possible at any point in the interval. Inflection points are excluded, because no tangent line is possible at points of inflection, only **half-tangent lines**.

### Tangent Line

A tangent line is a finite straight line, such that it meets a curve in only one point, extends to both sides of the point and crosses the curve nowhere.

Since real numbers do not exist and there is no valid construction of the same, you are required to think in terms of only length magnitudes whose measure may be possible or not. Thus, the function is defined everywhere in terms of length magnitudes if there are no disjoint paths.

### Arithmetic Mean

The phrase "Arithmetic Mean" is really a misnomer, as it implies a "middle", but ironically, it has nothing to do with the middle of anything. "Level magnitude" would be a better name.

Given any set of numbers or magnitudes, the arithmetic mean indicates a value that each number would have, if all the numbers in the set were made to be equal through a process of redistribution. An arithmetic mean leads to correct inference, if and only if, redistribution makes sense.

Suppose that numbers are represented by blocks as in the following diagram:

<img src="/assets/images/new_calculus__4.png" class="half-width-image"/>

It's easy to see that if the green block is moved from pile 3 to pile 1, then all three piles will be level and equal.

<img src="/assets/images/new_calculus__5.png" class="half-width-image"/>

The arithmetic mean is clearly given by

$$
\begin{align*}
\frac{1+2+3}{3} = \frac{6}{3} = 2
\end{align*}
$$

### Area

Area is the product of two [Arithmetic Means](#definitions_arithmetic-mean).

<img src="/assets/images/new_calculus__3.png" class="half-width-image"/>

The horizontal side length is the [Arithmetic Mean](#definitions_arithmetic-mean) of the "infinitely many" horizontal line lengths in a parallelogram. The vertical side length is the [Arithmetic Mean](#definitions_arithmetic-mean) of the infinitely many vertical line lengths in a parallelogram.

The horizontal line length [Arithmetic Mean](#definitions_arithmetic-mean) is given by $\frac{k*w}{k} = w$ where $w$ is the length of each horizontal line. Similarly, the vertical line length [Arithmetic Mean](#definitions_arithmetic-mean) is given by $\frac{k*h}{k} = h$ where $h$ is the height of each vertical line.

TODO: This sounds very similar to Cavalieri's principle. Is the latter essentially just another representation of this concept?

### Volume

Analogous to [Area](#definitions-area), volume is the product of three [Arithmetic Means](#definitions_arithmetic-mean).

## Finite Difference Quotient Factor h

<img src="/assets/images/new_calculus__1.jpg" class="half-width-image"/>

Let there be any [smooth curve](#definitions-smoothness) $f(x)$, intersected twice by a secant line at endpoints $A = (x, f(x))$ and $C = (x+h, f(x+h))$. The horizontal distance $h$ is represented by the side $\overline{AB}$ of $\triangle{ABC}$, parallel to the $x$-axis, while the vertical distance, $f(x+h) - f(x)$ is represented by the side $\overline{BC}$, by [Dropping A Perpendicular](/math/construction#dropping-a-perpendicular) from point $C$ relative to line $\overline{AB}$, thereby making the angle $\angle{ABC}$ a right angle.

It now follows, that

$$
\beta = \arctan\left(\frac{h}{f(x+h)-f(x)}\right)
$$

and

$$
\alpha = \frac{\pi}{2} - \beta
$$

but also, that

$$
\alpha = \arctan\left(\frac{f(x+h)-f(x)}{h}\right)
$$

thus

$$
\begin{align*}
\frac{\pi}{2} - \beta &= \arctan\left(\frac{f(x+h)-f(x)}{h}\right) \\
\frac{\pi}{2} - \arctan\left(\frac{h}{f(x+h)-f(x)}\right) &= \arctan\left(\frac{f(x+h)-f(x)}{h}\right) \\
\tan\left(\frac{\pi}{2} - \arctan\left(\frac{h}{f(x+h)-f(x)}\right)\right) &= \frac{f(x+h)-f(x)}{h} \\
h * \tan\left(\frac{\pi}{2} - \arctan\left(\frac{h}{f(x+h)-f(x)}\right)\right) &= f(x+h)-f(x)
\end{align*}
$$

and thereby, that $h$ is a factor of the numerator of the finite difference quotient, namely of $f(x+h)-f(x)$.

## Historic MVT

<img src="/assets/images/new_calculus__2.png" class="half-width-image"/>

The following will explain why the mean value theorem works, in a systematic way using the flawed apparatus available in mainstream calculus with a patch (positional derivative) which John conceived to make this possible. The proof using the New Calculus requires no patch.

If $f$ is [continuous](#definitions-continousness) on the closed interval $[x, x + \omega]$, and [smooth](#definitions-smoothness) on the open interval $(x;x + \omega)$, then there exists a point $c$ in $(x;x + \omega)$ such that

$$
f'(c) = \frac{f(x+\omega)-f(x)}{\omega}
$$

Essentially a function path is described by a distance or length magnitude. We can think of the $x$-coordinate magnitude as $x + \frac{k*\omega}{n}$ where $\omega$ is the interval width, $k$ is a rational number denoting the index of the $y$-ordinate and $n$ is the number of equal subdivisions or partitions of the interval. Hence, the $y$-coordinates are then given by $f(x + \frac{k*\omega}{n})$. But you may say, not ALL the ordinates are addressed this way. This does not matter as the following proof, involving a telescoping sum, will demonstrate.

Define the derivative as follows:

$$
f'(x) = \lim \limits_{n \to \infty} \left(\frac{f\left(x+\frac{w}{n}\right)-f(x)}{\frac{\omega}{n}}\right)
$$

where $\omega$ is the interval width between $x$ and $x + \omega$, and $\frac{\omega}{n}$ is the width of each equal partition in $(x;x+\omega)$.

Using the new definition, we can define any of the positional derivatives at a point $(x, x + \frac{k*\omega}{n})$ as follows:

$$
\begin{align*}
\lim \limits_{n \to \infty} f'\left(x + \frac{k*\omega}{n}\right) &= \lim \limits_{n \to \infty} \left(\frac{f\left(\left(x + \frac{k*\omega}{n}\right)+\frac{w}{n}\right)-f(x + \frac{k*\omega}{n})}{\frac{\omega}{n}}\right) \\
&= \lim \limits_{n \to \infty} \left(\frac{f\left(x + \frac{k*\omega + \omega}{n}\right)-f(x + \frac{k*\omega}{n})}{\frac{\omega}{n}}\right) \\
&= \lim \limits_{n \to \infty} \left(\frac{f\left(x + \frac{\omega*(k + 1)}{n}\right)-f(x + \frac{k*\omega}{n})}{\frac{\omega}{n}}\right)
\end{align*}
$$

Let's **assume** that the LHS of the Mean Value Theorem, that is, $f'(c)$, is an [Arithmetic Mean](#definitions_arithmetic-mean) of **all** the ("infinitely many") ordinates of $f'$ in the interval $(x;x+\omega)$, then

$$
f'(c) = \lim \limits_{n \to \infty}\left(\frac{1}{n}*\sum_{k=0}^{n - 1} f'\left(x + \frac{k*\omega}{n}\right) \right)
$$

Expanding this sum will yield

$$
\begin{align*}
\lim \limits_{n \to \infty}\left(\frac{1}{n}*\sum_{k=0}^{n - 1} f'\left(x + \frac{k*\omega}{n}\right) \right) &= \lim \limits_{n \to \infty}\biggl(\frac{1}{n}*\biggl( \\
&f'(x) \\
&+ f'\left(x + \frac{\omega}{n}\right) \\
&+ f'\left(x + \frac{2*\omega}{n}\right) \\
&+ \dotsm \\
&+ f'\left(x + \frac{(n-2)*\omega}{n}\right) \\
&+ f'\left(x + \frac{(n-1)*\omega}{n}\right)\biggr)\biggr)
\end{align*}
$$

Replacing each positional derivative with its expanded form yields

$$
\begin{align*}
\lim \limits_{n \to \infty}\left(\frac{1}{n}*\sum_{k=0}^{n - 1} f'\left(x + \frac{k*\omega}{n}\right) \right) &= \lim \limits_{n \to \infty}\biggl(\frac{1}{n}*\biggl(\lim \limits_{n \to \infty}\frac{n}{\omega}*\biggl[\\
&f\left(x+\frac{w}{n}\right)-f(x) \\
&+f\left(\left(x + \frac{\omega}{n}\right)+\frac{w}{n}\right)-f\left(x + \frac{\omega}{n}\right) \\
&+f\left(\left(x + \frac{2*\omega}{n}\right)+\frac{w}{n}\right)-f\left(x + \frac{2*\omega}{n}\right) \\
&+ \dotsm \\
&+f\left(\left(x + \frac{(n-2)*\omega}{n}\right)+\frac{w}{n}\right)-f\left(x + \frac{(n-2)*\omega}{n}\right) \\
&+f\left(\left(x + \frac{(n-1)*\omega}{n}\right)+\frac{w}{n}\right)-f\left(x + \frac{(n-1)*\omega}{n}\right)\biggr]\biggr)\biggr) \\
\end{align*}
$$

Collecting fractions and color-coding by cancellation yields

$$
\begin{align*}
\lim \limits_{n \to \infty}\left(\frac{1}{n}*\sum_{k=0}^{n - 1} f'\left(x + \frac{k*\omega}{n}\right) \right) &= \lim \limits_{n \to \infty}\biggl(\frac{1}{n}*\biggl(\lim \limits_{n \to \infty}\frac{n}{\omega}*\biggl[\\
&\textcolor{magenta}{f\left(x+\frac{w}{n}\right)}-f(x) \\
&+\textcolor{cyan}{f\left(x + \frac{2*\omega}{n}\right)}\textcolor{magenta}{-f\left(x + \frac{\omega}{n}\right)} \\
&+\textcolor{LimeGreen}{f\left(x + \frac{3*\omega}{n}\right)}\textcolor{cyan}{-f\left(x + \frac{2*\omega}{n}\right)} \\
&+ \dotsm \\
&+\textcolor{orange}{f\left(x + \frac{(n-1)*\omega}{n}\right)}\textcolor{LimeGreen}{-f\left(x + \frac{(n-2)*\omega}{n}\right)} \\
&+f\left(x + \frac{\cancel{n}*\omega}{\cancel{n}}\right)\textcolor{orange}{-f\left(x + \frac{(n-1)*\omega}{n}\right)}\biggr]\biggr)\biggr) \\
\\
&= \lim \limits_{n \to \infty}\left(\frac{1}{n}*\left(\lim \limits_{n \to \infty}\frac{n}{\omega}*\left[-f(x) + f(x + \omega)\right]\right)\right)
\end{align*}
$$

Since the $n$ in both $\frac{1}{n}$ and $\frac{n}{\omega}$ refers to the same number of equal subdivisions, they cancel out, leaving no more occurrence of $n$, and thereby erase the need of a limit.

$$
\begin{align*}
\lim \limits_{n \to \infty}\left(\frac{1}{n}*\sum_{k=0}^{n - 1} f'\left(x + \frac{k*\omega}{n}\right) \right) &= \lim \limits_{n \to \infty}\left(\frac{1}{\cancel{n}}*\left(\lim \limits_{n \to \infty}\frac{\cancel{n}}{\omega}*\left[-f(x) + f(x + \omega)\right]\right)\right) \\
&= \frac{1}{\omega}*\left[-f(x) + f(x + \omega)\right] \\
&= \frac{f(x + \omega) - f(x)}{\omega} \\
\end{align*}
$$

By letting $x = a$ and $x + \omega = b \Rightarrow \omega = b - x = b - a$, we arrive at the ubiquitous form:

$$
f'(c) = \frac{f(b) - f(a)}{b - a}
$$

Now, the fundamental theorem of calculus is derived in one step from the mean value theorem:

$$
f'(c) = \frac{1}{b-a} * \int_{a}^{b} f'(x) \,dx
$$

Since [Area](#definitions-area) is well defined as the product of two [Arithmetic Means](#definitions_arithmetic-mean), it follows that

$$
\mathrm{Area} = f'(c) * (b - a)
$$

where $f'(c)$ is the [Arithmetic Mean](#definitions_arithmetic-mean) of all the vertical line lengths of $f'(x)$ in the inverval $(a,b)$ and $b-a$ is the [Arithmetic Mean](#definitions_arithmetic-mean) of all the horizontal line lengths or just the interval width.

This is why we call the process of finding areas through definite integration "*quadrature*" - we essentially normalise the irregular area so that it becomes a quadrilateral.

Substituting the ubiquitous form into the area formula above, we receive

$$
\begin{align*}
\mathrm{Area} &= f'(c) * (b - a) \\
&= \frac{f(b) - f(a)}{\cancel{b - a}} * \cancel{(b - a)} \\
&= f(b) - f(a)
\end{align*}
$$

And thus follows the fundamental throrem

$$
\int_{a}^{b} f'(c) \,dx = f(b) - f(a)
$$

## New Calculus Derivative

<img src="/assets/images/new_calculus__6.png" class="half-width-image"/>

The derivative in the New Calculus is the slope of a tangent line that is defined as follows:

$$
f'(x) = \frac{f(x + n) - f(x - m)}{m + n}
$$

where $m$ and $n$ are horizontal distances from the point of tangency $(x, f(x))$ to the endpoints of a secant line that is parallel to the tangent line at the same point and $x - m < x < x + n$.

The definition can also be written as follows

$$
f'(x) = \frac{f(x + n) - f(x - m)}{m + n} = f'(x) + Q(x,m,n)
$$

Where $Q(x,m,n) = 0$. The expression $Q(x,m,n)$ is obtained if every factor $m + n$ is cancelled from the numerator and denominator of the finite difference quotient and is comprised of any combination in $m$ and $n$ which may or may not contain $x$.

It is easy to prove that $m + n$ is a "real" factor of every term in the numerator. From the definition

$$
\begin{align*}
f'(x) &= \frac{f(x + n) - f(x - m)}{m + n} \\
f'(x) * (m + n) &= f(x + n) - f(x - m)
\end{align*}
$$

$m + n$ is a factor of the left hand side, therefore it is also a factor of the right hand side. If we divide the left hand side by $m + n$, the result is $f'(x)$. But $f(x + n) - f(x - m)$ is not equal to $f'(x)$. Algebra tells us that the right hand side must equal to the left hand side, which is only possible if $m + n$ is a factor.

From the point of tangency, it is possible to construct any number of similar triangles whose one side is a parallel secant line. This fact is true for any function that is continuous and smooth. The only exception is if the given point is a point of inflection, in which case a tangent line is not possible and hence a derivative is meaningless. A derivative is the slope of a special kind of straight line: one that is tangent to another curve. No straight line can be tangent to another straight line.

In the diagram that follows, two similar triangles are shown, but innumerably many such triangles are possible.

<img src="/assets/images/new_calculus__7.png" class="half-width-image"/>

It is easy to see that the slope of any tangent line is given by the slope of any parallel secant line:

$$
\frac{\textcolor{OrangeRed}{\mathrm{rise}}}{\textcolor{RoyalBlue}{\mathrm{run}}} = \frac{\textcolor{magenta}{\mathrm{rise}}}{\textcolor{Goldenrod}{\mathrm{run}}} = \frac{\textcolor{OrangeRed}{\mathrm{rise}} + \textcolor{magenta}{\mathrm{rise}}}{\textcolor{RoyalBlue}{\mathrm{run}} + \textcolor{GoldenRod}{\mathrm{run}}} = \frac{f(x+n)-f(x-m)}{m+n}
$$

Different values for m and n are possible, given that every parallel secant line has a unique $(m,n)$ pair. It is impossible for any parallel secant line's slope to be defined by a $(0,0)$ pair, hence $m+n$ is **never equal to zero**. However, given that $f'(x) = f'(x) + Q(m,n,x)$ and every term in $Q(m,n,x)$ has either $m$ or $n$ or both, setting $m=n=0$ is equivalent to the value of $Q(x,m,n)$, which is of course always $0$.

### Auxiliary Equation

The auxiliary equation represents the difference in slope between the tangent line and a non-parallel secant line. Let's begin with a simple yet expressive example.

$$
\begin{align*}
f(x) &= x^3 \\
f'(x) &= \frac{(x + n)^3 - (x - m)^3}{m + n} \\
f'(x) &= \frac{(x^3 + 3*x^2*n + 3*x*n^2 + n^3) - (x^3 + 3*x^2*(-m) + 3*x*(-m)^2 + (-m)^3)}{m + n} \\
f'(x) &= \frac{(x^3 + 3*x^2*n + 3*x*n^2 + n^3) - (x^3 - 3*x^2*m + 3*x*m^2 - m^3)}{m + n} \\
f'(x) &= \frac{\cancel{x^3} + 3*x^2*n + 3*x*n^2 + n^3 - \cancel{x^3} + 3*x^2*m - 3*x*m^2 + m^3}{m + n} \\
f'(x) &= \frac{3*x^2*(n+m) + 3*x*(n+m)*(n-m) + n^3 + m^3}{m + n} \\
f'(x) &= \frac{3*x^2*(n+m) + 3*x*(n+m)*(n-m) + (m^2 - m*n + n^2) * (m+n)}{m + n} \\
f'(x) &= \frac{\cancel{(m+n)}*(3*x^2 + 3*x*(n-m) + (m^2 - m*n + n^2))}{\cancel{m + n}} \\
f'(x) &= 3*x^2 + 3*x*(n-m) + m^2 - m*n + n^2
\end{align*}
$$

$$
\begin{align*}
Q(m,x,n) &= 0 = 3*x*(n-m) + m^2 - m*n + n^2 \\
\Rightarrow f'(x) &= 3*x^2 + Q(m,n,x) \\
f'(x) &= 3*x^2
\end{align*}
$$

$Q(m,n,x) = 0$ is known as the auxiliary equation in the New Calculus. Given $x$ and either $m$ or $n$, one can find the remaining value. More generally, given any two, one can find the remaining third.

By completing the square, we can express $m$ in terms of $x$ and $n$, or we can express $n$ in terms of $x$ and $m$:

$$
\begin{align*}
0 &= 3*x*(n-m) + m^2 - m*n + n^2 \\
&= 3*x*n - 3*x*m + m^2 - m*n + n^2 \\
&= m^2 + (-3*x -n)*m + (3*x*n + n^2) \\
&= m^2 - (3*x + n)*m + (3*x*n + n^2) \\
\end{align*}
$$

$$
\begin{align*}
\Rightarrow m_{1,2} &= -\left(-\frac{3*x + n}{2}\right) \pm \sqrt{\left(\frac{-(3*x + n)}{2}\right)^2 - (3*x*n + n^2)} \\
&= \frac{3*x + n}{2} \pm \sqrt{\left(\frac{-(3*x + n)}{2}\right)^2 - (3*x*n + n^2)} \\
&= \frac{3*x + n}{2} \pm \sqrt{\frac{((-1)*(3*x + n))^2}{4} - \frac{4*(3*x*n + n^2)}{4}} \\
&= \frac{3*x + n}{2} \pm \sqrt{\frac{(3*x + n)^2 - 4*(3*x*n + n^2)}{4}} \\
&= \frac{3*x + n}{2} \pm \frac{\sqrt{(3*x + n)^2 - 4*(3*x*n + n^2)}}{2} \\
&= \frac{3*x + n \pm \sqrt{(3*x + n)^2 - 4*(3*x*n + n^2)}}{2} \\
\end{align*}
$$

and

$$
\begin{align*}
0 &= 3*x*(n-m) + m^2 - m*n + n^2 \\
&= 3*x*n - 3*x*m + m^2 - m*n + n^2 \\
&= n^2 + (3*x - m) * n + (m^2 - 3*x*m)
\end{align*}
$$

$$
\begin{align*}
\Rightarrow n_{1,2} &= -\left(\frac{3*x - m}{2}\right) \pm \sqrt{\left(\frac{3*x - m}{2}\right)^2 - (m^2 - 3*x*m)} \\
&= \frac{m - 3*x}{2} \pm \sqrt{\frac{(3*x - m)^2}{4} - \frac{4*(m^2 - 3*x*m)}{4}} \\
&= \frac{m - 3*x}{2} \pm \sqrt{\frac{(3*x - m)^2 - 4*(m^2 - 3*x*m)}{4}} \\
&= \frac{m - 3*x}{2} \pm \frac{\sqrt{((-1) * (m - 3*x))^2 - 4*(m^2 - 3*x*m)}}{2} \\
&= \frac{m - 3*x \pm \sqrt{(m - 3*x)^2 - 4*(m^2 - 3*x*m)}}{2}
\end{align*}
$$

### Rules Of Derivation

The following sections derive the commonly known rules of derivation, based on only the definition of the derivative, as follows:

$$
f'(x) = \frac{f(x + n) - f(x - m)}{m + n} \\
$$

#### Power Rule

$$
\begin{align*}
f(x) &= b*x^a \\
\Rightarrow f'(x) &= \frac{b*(x + n)^a - b*(x - m)^a}{m + n} \\
\end{align*}
$$

Firstly performing the [Binomial Expansion](math/binomial-expansion), then [Factorizing Sum/Difference Of Two n-th Powers](#factorizing-sumdifference-of-two-n-th-powers) yields:

$$
\begin{align*}
f'(x) &= \frac{b*\sum_{k=0}^{a} \binom{a}{k}*x^{(a-k)}*n^{k} - b*\sum_{k=0}^{a} \binom{a}{k}*x^{(a-k)}*(-m)^{k}}{m + n} \\
&= \frac{(\cancel{b*x^a} + b*\sum_{k=1}^{a} \binom{a}{k}*x^{(a-k)}*n^{k}) - (\cancel{b*x^a} + b*\sum_{k=1}^{a} \binom{a}{k}*x^{(a-k)}*(-m)^{k})}{m + n} \\
&= \frac{b*\sum_{k=1}^{a} \binom{a}{k}*x^{(a-k)}*n^{k} - b*\sum_{k=1}^{a} \binom{a}{k}*x^{(a-k)}*(-m)^{k}}{m + n} \\
&= \frac{b*\sum_{k=1}^{a} \binom{a}{k}*x^{(a-k)}*(n^{k} - (-m)^{k})}{m + n} \\
&= \frac{b*(\binom{a}{1} * x^{a-1} * (n-(-m))) + b*\sum_{k=2}^{a} \binom{a}{k}*x^{(a-k)}*(n^{k} - (-m)^{k})}{m + n} \\
&= \frac{(b * a * x^{a-1} * (n+m)) + b*\sum_{k=2}^{a} \binom{a}{k}*x^{(a-k)}*(n^{k} - (-m)^{k})}{m + n} \\
&= \frac{(b * a * x^{a-1} * (n+m)) + b*\sum_{k=2}^{a} \binom{a}{k}*x^{(a-k)}*((m+n) * \sum_{j=0}^{k-1} m^{(k-1)-j} * (-n)^j)}{m + n} \\
&= \frac{(b * a * x^{a-1} * (n+m)) + (n+m) * b*\sum_{k=2}^{a} \binom{a}{k}*x^{(a-k)}*\sum_{j=0}^{k-1} m^{(k-1)-j} * (-n)^j}{m + n} \\
&= \frac{\cancel{(n+m)}*((b * a * x^{a-1}) + b*\sum_{k=2}^{a} \binom{a}{k}*x^{(a-k)}*\sum_{j=0}^{k-1} m^{(k-1)-j} * (-n)^j)}{\cancel{m + n}} \\
&= (b * a * x^{a-1}) + b*\sum_{k=2}^{a} \binom{a}{k}*x^{(a-k)}*\sum_{j=0}^{k-1} m^{(k-1)-j} * (-n)^j \\
&= (b * a * x^{a-1}) + Q(x,m,n)
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
f'(x) &= (b * a * x^{a-1}) + Q(x,0,0) \\
&= b * a * x^{a-1}
\end{align*}
$$

Let's see an example

$$
\begin{align*}
f(x) &= 3*x^4 \Rightarrow a = 4,\, b = 3 \\
\Rightarrow f'(x) &= (4 * 3 * x^{4-1}) + 3 * \sum_{k=2}^{4} \binom{4}{k}*x^{(4-k)}*\sum_{j=0}^{k-1} m^{(k-1)-j} * (-n)^j \\
&= 12 * x^3 + 3 * (6*x^{2}*(m - n) + 4*x*(m^2 - m*n + n^2) + (m^3 - m^2*n + m*n^2 - n^3)) \\
&= 12 * x^3 + [18*x^{2}*(m - n) + 12*x*(m^2 - m*n + n^2) + 3*(m^3 - m^2*n + m*n^2 - n^3)] \\
&= 12*x^3 + Q(x,m,n)
\end{align*}
$$

TODO: This derivation does not include rational exponents.

#### Constant Rule

The constant rule is already implied by the [Power Rule](#new-calculus-derivative_rules-of-derivation_power-rule), which states the following:

$$
\begin{align*}
f(x) &= b*x^a \\
\Rightarrow f'(x) &= (b * a * x^{a-1}) + Q(x,m,n)
\end{align*}
$$

A constant function can be rewritten as a multiple of $x^0$.

$$
\begin{align*}
f(x) &= b \\
&= b * x^0 \\
\end{align*}
$$

When deriving, the exponent will become a factor, and thereby the value diminishes into zero.

$$
\begin{align*}
f(x) &= b * x^0 \\
f'(x) &= 0 * b * x^{-1} + Q(x,m,n) \\
&= Q(x,m,n) \\
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
f'(x) &= Q(x,0,0) \\
&= 0
\end{align*}
$$

#### Constant Multiple Rule

$$
\begin{align*}
f(x) &= b*g(x) \\
\Rightarrow f'(x) &= \frac{b*g(x+n) - b*g(x-m)}{m + n} \\
&= b*\frac{g(x+n) - g(x-m)}{m + n} \\
&= b*[g'(x) + Q_g(x,m,n)] \\
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
f'(x) &= b*[g'(x) + Q_g(x,0,0)] \\
&= b*g'(x)
\end{align*}
$$

#### Sum/Difference Rule

$$
\begin{align*}
(f(x) \pm g(x))' &= \frac{[f(x + n) \pm g(x + n)] - [f(x - m) \pm g(x - m)]}{m + n} \\
&= \frac{f(x + n) \pm g(x + n) - f(x - m) \mp g(x - m)}{m + n} \\
&= \frac{[f(x + n) - f(x - m)] + [\pm g(x + n) \mp g(x - m)]}{m - n} \\
&= \frac{[f(x + n) - f(x - m)] \pm [g(x + n) - g(x - m)]}{m - n} \\
&= \frac{f(x + n) - f(x - m)}{m+n} \pm \frac{g(x + n) - g(x - m)}{m + n} \\
&= [f'(x) + Q_f(x,m,n)] \pm [g'(x) + Q_g(x,m,n)]
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
(f(x) \pm g(x))' &= [f'(x) + Q_f(x,0,0)] \pm [g'(x) + Q_g(x,0,0)] \\
&= f'(x) \pm g'(x)
\end{align*}
$$

#### Product Rule

$$
\begin{align*}
(f(x) * g(x))' &= \frac{[f(x + n) * g(x + n)] - [f(x - m) * g(x + n)]}{m + n} \\
&= \frac{f(x + n) * g(x + n) - f(x + n)*g(x - m) + f(x + n)*g(x - m) - f(x - m) * g(x + n)}{m + n} \\
&= \frac{f(x + n) * (g(x + n) - g(x - m)) + g(x - m)*(f(x + n) - f(x - m))}{m + n} \\
&= f(x + n) * \frac{g(x + n) - g(x - m)}{m+n} + g(x - m) * \frac{f(x + n) - f(x - m)}{m + n} \\
&= f(x + n) * [g'(x) + Q_g(x,m,n)] + g(x - m) * [f'(x) + Q_f(x,m,n)]\\
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
(f(x) * g(x))' &= f(x + 0) * [g'(x) + Q_g(x,0,0)] + g(x - 0) * [f'(x) + Q_f(x,0,0)]\\
&= f(x) * g'(x) + g(x) * f'(x)
\end{align*}
$$

#### Quotient Rule

$$
\begin{align*}
\left(\frac{f(x)}{g(x)}\right)' &= \frac{f'(x)*g(x) - f(x)*g'(x)}{(g(x))^2} \\
&= \frac{(\frac{f(x+n) - f(x-m)}{m+n})*g(x) - f(x)*(\frac{g(x+n) - g(x-m)}{m+n})}{(g(x))^2} \\
\end{align*}
$$

$$
\begin{align*}
\left(\frac{f(x)}{g(x)}\right)' &= \frac{\left[\frac{f(x + n)}{g(x + n)}\right] - \left[\frac{f(x - m)}{g(x - m)}\right]}{m + n} \\
&= \frac{\frac{f(x + n)}{g(x + n)}}{m+n} - \frac{\frac{f(x - m)}{g(x - m)}}{m + n} \\
&= \frac{f(x + n)}{g(x + n)*(m+n)} - \frac{f(x - m)}{g(x - m)*(m + n)} \\
&= \frac{f(x + n)*g(x - m)}{g(x - m)*g(x + n)*(m+n)} - \frac{f(x - m)*g(x + n)}{g(x + n)*g(x - m)*(m + n)} \\
&= \frac{f(x + n)*g(x - m) - f(x - m)*g(x + n)}{g(x + n)*g(x - m)*(m + n)} \\
&= \frac{f(x + n)*g(x - m) - f(x - m)*g(x + n)}{(m + n)} * \frac{1}{g(x+n)*g(x-m)} \\
&= \frac{f(x + n)*g(x - m) - f(x-m)*g(x-m) + f(x-m)*g(x-m) - f(x - m)*g(x + n)}{m + n} * \frac{1}{g(x+n)*g(x-m)} \\
&= \left(\frac{f(x + n)*g(x - m) - f(x-m)*g(x-m)}{m+n} + \frac{f(x-m)*g(x-m) - f(x - m)*g(x + n)}{m + n}\right) * \frac{1}{g(x+n)*g(x-m)} \\
&= \left(\frac{f(x + n)*g(x - m) - f(x-m)*g(x-m)}{m+n} - \frac{f(x - m)*g(x + n) - f(x-m)*g(x-m)}{m + n}\right) * \frac{1}{g(x+n)*g(x-m)} \\
&= \left(g(x-m)*\frac{f(x + n) - f(x-m)}{m+n} - f(x-m)*\frac{g(x + n) - g(x-m)}{m + n}\right) * \frac{1}{g(x+n)*g(x-m)} \\
&= \frac{g(x-m)*[f'(x) + Q_f(x,m,n)] - f(x-m)*[g'(x) + Q_g(x,m,n)]}{g(x+n)*g(x-m)} \\
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
\left(\frac{f(x)}{g(x)}\right)' &= \frac{g(x-0)*[f'(x) + Q_f(x,0,0)] - f(x-0)*[g'(x) + Q_g(x,0,0)]}{g(x+0)*g(x-0)} \\
&= \frac{g(x)*f'(x) - f(x)*g'(x)}{g^2(x)}
\end{align*}
$$

#### Chain Rule

$$
\begin{align*}
(f(g(x)))' &= \frac{f(g(x+n)) - f(g(x-m))}{m+n} \\
&= \frac{f(g(x+n)) - f(g(x-m)) * (g(x+n)-g(x-m))}{(m+n) * (g(x+n)-g(x-m))} \\
&= \frac{f(g(x+n)) - f(g(x-m))}{(g(x+n)-g(x-m))} * \frac{g(x+n)-g(x-m)}{(m+n)} \\
&= \frac{f(g(x+n)) - f(g(x-m))}{(g(x+n)-g(x-m))} * [g'(x) + Q(x,m,n)] \\
\end{align*}
$$

Introducing the following substitutions

$$
\begin{align*}
g(x+n) &= g(x) + p \\
g(x-m) &= g(x) - q \\
\end{align*}
$$

yields

$$
\begin{align*}
(f(g(x)))' &= \frac{f(g(x) + p) - f(g(x) - q)}{(g(x) + p -(g(x) - q))} * [g'(x) + Q(x,m,n)] \\
&= \frac{f(g(x) + p) - f(g(x) - q)}{(\cancel{g(x)} + p - \cancel{g(x)} + q)} * [g'(x) + Q(x,m,n)] \\
&= \frac{f(g(x) + p) - f(g(x) - q)}{p + q} * [g'(x) + Q(x,m,n)] \\
&= [f'(g(x)) + Q(g(x),p,q)] * [g'(x) + Q(x,m,n)] \\
\end{align*}
$$

For $m=n=0$

$$
\begin{align*}
g(x+0) &= g(x) + p \Rightarrow p = 0 \\
g(x-0) &= g(x) - q \Rightarrow q = 0
\end{align*}
$$

$$
\begin{align*}
(f(g(x)))' &= [f'(g(x)) + Q(g(x),0,0)] * [g'(x) + Q(x,0,0)] \\
&= f'(g(x)) * g'(x)
\end{align*}
$$

### Natural Logarithm Derivative

For $\ln(x)$, it is much easier to use the historic geometric theorem, as follows.

$$
\begin{align*}
\frac{\ln(x+h) - ln(x)}{h} &= f'(x) + Q(x,h) \\
&= \frac{\ln\left(\frac{x+h}{x}\right)}{h} \\
&= \frac{1}{h} * \ln\left(\frac{x+h}{x}\right) \\
&= \ln\left(\left(\frac{x+h}{x}\right)^{\frac{1}{h}}\right) \\
&= \ln\left(\left(1 + \frac{h}{x}\right)^{\frac{1}{h}}\right) \\
\end{align*}
$$

Let's look at what the parameter of $\ln$ expands to, by performing [Rational Exponent Binomial Expansion](#rational-exponent-binomial-expansion).

$$
\begin{align*}
\left(1 + \frac{h}{x}\right)^{\frac{1}{h}} &= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{h^i}}{k!} * \left(\frac{h}{x}\right)^k \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{h^i}}{k!} * \frac{h^k}{x^k} \\
&= 1 + \sum_{k=1}^{\infty} \frac{\frac{h^k}{x^k} * \sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{h^i}}{k!} \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{h^i}*\frac{h^k}{x^k}}{k!} \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{h^k}{h^i}*\frac{1}{x^k}}{k!} \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*h^{k-i}*\frac{1}{x^k}}{k!} \\
&= 1 + \frac{1}{x} + \sum_{k=2}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*h^{k-i}*\frac{1}{x^k}}{k!} \\
&= 1 + \frac{1}{x} + \sum_{k=2}^{\infty} \frac{\frac{1}{x^k} + \sum_{i=1}^{k-1}{k \brack i}*(-1)^{k-i}*h^{k-i}*\frac{1}{x^k}}{k!} \\
\end{align*}
$$

But $h=0$, so

$$
\begin{align*}
&= 1 + \frac{1}{x} + \sum_{k=2}^{\infty} \frac{\frac{1}{x^k}}{k!} \\
&= 1 + \frac{1}{x} + \frac{\left(\frac{1}{x}\right)^2}{2!} + \frac{\left(\frac{1}{x}\right)^3}{3!} + \frac{\left(\frac{1}{x}\right)^4}{4!} + \dotsm
\end{align*}
$$

Which is, as described in [The Exponential Function](#the-exponential-function)

$$
= e^{\frac{1}{x}}
$$

thereby making

$$
\begin{align*}
(\ln(x))' &= \ln(e^{\frac{1}{x}}) + Q(x,h) \\
&= \frac{1}{x} + Q(x,h) \\
\end{align*}
$$

Since $Q(x,h)$ is just the slope difference, we can ignore it.

$$
\begin{align*}
(\ln(x))' &= \frac{1}{x}
\end{align*}
$$

## New Calculus MVT

It makes sense to use the New Calculus definition of [Derivative](#new-calculus-derivative) because it also shows immediately the connection between the integral and the derivative in the fundamental theorem of calculus which is derived in one step from the mean value theorem.

We begin with the New Calculus definition of derivative:

$$
f'(c) = \frac{f(c + n) - f(c - m)}{m + n}
$$

<img src="/assets/images/new_calculus__8.png" class="half-width-image"/>

In the previous diagram, the interval $(c-m;c+n)$ is divided into equal partitions or sub-intervals of $\frac{m+n}{k}$. The point $c$ is the abscissa ($x$-coordinate) of the arithmetic mean $f'(c)$ of all the vertical line lengths.

It is required to prove that the arithmetic mean of the gradients of the **purple** tangent lines is equal to the gradient of the **blue** tangent line at $c$ which is equal to the gradient of the **red** secant line.

If there were a mean abscissa $\mu_s$ in each of the sub-intervals, then for the same $\mu_s$, we must have $f'(\mu_s)$ such that

$$
f'(\mu_s) = \frac{f\left((c-m) + (s+1) * \frac{m+n}{k}\right) - f\left((c-m) + s * \frac{m+n}{k}\right)}{\frac{m+n}{k}}
$$

This follows from the fact that the arithmetic mean of the arithmetic means of all sub-intervals will be $f'(c)$. However, none of these assumptions are actually needed, because the New Calculus derivative $f'(\mu_s)$ is by definition equal to the mean value theorem for the given sub-interval. At any rate, if these assumptions are incorrect, then the following reasoning will result in a contradiction.

The mean of all arithmetic means is given by

$$
f'(c) = \frac{1}{k} * \sum_{s=1}^{k} f'(\mu_s)
$$

In the previous statement, we begin by attempting to find the arithmetic mean of all the sub-interval arithmetic means, that is, to show that

$$
f'(c) = \frac{f'(\mu_1) + f'(\mu_2) + f'(\mu_3) + \dotsm + f'(\mu_{k - 1}) + f'(\mu_k)}{k}
$$

Expanding the sum for $s = 1$ to $s = k$:

$$
\begin{align*}
f'(c) &= \frac{1}{k}*(f'(\mu_1) + f'(\mu_2) + f'(\mu_3) + \dotsm + f'(\mu_{k - 1}) + f'(\mu_k)) \\
&= \frac{1}{k}*\biggl( \\
&+ \frac{\textcolor{magenta}{f\left((c-m)+\frac{m+n}{k}\right)} - f\left(c-m\right)}{\frac{m+n}{k}} \\
&+ \frac{\textcolor{cyan}{f\left((c-m)+2*\frac{m+n}{k}\right)} \textcolor{magenta}{- f\left((c-m)+\frac{m+n}{k}\right)}}{\frac{m+n}{k}} \\
&+ \frac{\textcolor{LimeGreen}{f\left((c-m)+3*\frac{m+n}{k}\right)} \textcolor{cyan}{- f\left((c-m)+2*\frac{m+n}{k}\right)}}{\frac{m+n}{k}} \\
&+ \frac{\textcolor{orange}{f\left((c-m)+(k-1)*\frac{m+n}{k}\right)} \textcolor{LimeGreen}{- f\left((c-m)+(k-2)*\frac{m+n}{k}\right)}}{\frac{m+n}{k}} \\
&\frac{f\left((c-\cancel{m})+\cancel{k}*\frac{\cancel{m}+n}{\cancel{k}}\right) \textcolor{orange}{- f\left((c-m) + (k-1)*\frac{m+n}{k}\right)}}{\frac{m+n}{k}}\biggr) \\
&= \frac{1}{k}*\left(\frac{f(c+n)}{\frac{m+n}{k}} - \frac{f(c-m)}{\frac{m+n}{k}}\right) \\
&= \frac{1}{\cancel{k}}*\frac{\cancel{k}}{m+n}(f(c+n) - f(c-m)) \\
&= \frac{f(c+n) - f(c-m)}{m+n} \\
\end{align*}
$$

Note that it does not matter what $k$ we choose, because the arithmetic mean is always the same. Thus, for the purposes of quadrature, the seemingly impossible task of finding the arithmetic mean of innumerably many $y$-ordinates is accomplished by a reducible- or telescoping-sum.

## Factorizing Sum/Difference Of Two n-th Powers

Statement:

$$
\forall n \in \mathbb{N} : n \ge 2 \\
\mathrm{I}: a^n - b^n = (a-b) * \sum_{k=0}^{n-1} a^{(n-1)-k} * b^k \\
$$

Base case ($n=2$):

$$
a^2 - b^2 = (a-b)*(a+b) = (a-b)*\sum_{k=0}^{1} a^{(2-1)-k} * b^k
$$

For $n+1$:

$$
\begin{align*}
a^{n+1} - b^{n+1} &= (a-b) * \sum_{k=0}^{n - \cancel{1} + \cancel{1}} a^{n-k} * b^k \\
&= (a-b) * \left(\sum_{k=0}^{n - 1} a^{n-k} * b^k + (a^{n - n} * b^n)\right) \\
&= (a-b) * \left(\sum_{k=0}^{n - 1} a * a^{(n-1)-k} * b^k + b^n\right) \\
&= (a-b) * \left(a*\sum_{k=0}^{n - 1} a^{(n-1)-k} * b^k + b^n\right) \\
&= a * \textcolor{orange}{(a-b) * \sum_{k=0}^{n - 1} a^{(n-1)-k} * b^k} + (a-b)*b^n \\
&= a*\textcolor{orange}{(a^n - b^n)} + (a-b)*b^n \\
&= a^{n+1} - \cancel{a*b^n} + \cancel{a*b^n} - b^{n+1} \\
&= a^{n+1} - b^{n+1} \\
\end{align*}
$$

---

Relation $\mathrm{I}$ can be partially expanded into the sum of n-th powers, by substituting $(-b)$ for $b$, as follows:

$$
a^n - (-b)^n = (a-(-b)) * \sum_{k=0}^{n-1} a^{(n-1)-k} * (-b)^k \\
$$

$b$'s negative sign will only persist on uneven powers of $n$ though, thus the following holds:

$$
\forall n \in \mathbb{N} : n \ge 3 \land 2 \nmid n \\
\mathrm{II}: a^n + b^n = (a+b) * \sum_{k=0}^{n-1} a^{(n-1)-k} * (-b)^k \\
$$

Since the sum ranges from $k=0$ to $k=n-1$, and each summand is multiplied by $(-b)^k$, the sum will consist of summands with alternating signs, starting out positive, from left to right.

$$
a^n + b^n = (a+b) * (a^{n-1} - a^{n-2}*b + a^{n-3}*b^2 - \dotsm - a*b^{n-2} + b^{n-1})
$$

---

On even powers, it becomes possible to extract $(a+b)$ instead of $(a-b)$, by modifying relation $\mathrm{I}$, as $(-b)^n$ will always be equivalent to $b$.

$$
\forall n \in \mathbb{N} : n \ge 2 \land 2 \mid n \\
$$

$$
\begin{align*}
a^n - b^n &= (a-b) * \sum_{k=0}^{n-1} a^{(n-1)-k} * b^k \\
a^n - (-b)^n &= (a-(-b)) * \sum_{k=0}^{n-1} a^{(n-1)-k} * (-b)^k \\
\mathrm{III}: a^n - b^n &= (a+b) * \sum_{k=0}^{n-1} a^{(n-1)-k} * (-b)^k \\
\end{align*}
$$

### Summary

In order to factorize expressions of the pattern $(a^n - (-b)^n)$ into $(a+b)*\dotsm$, a case-decision is to be made. Since $n=1$ and $n=2$ are obvious cases, $n \ge 3$, then

* if $2 \nmid n$, the expression will simplify to $(a^n + b^n)$, where relation $\mathrm{II}$ applies.
* if $2 \mid n$, the expression will simplify to $(a^n - b^n)$, where relation $\mathrm{III}$ applies.

Since $\mathrm{II}$ and $\mathrm{III}$ both share an equivalent RHS, it follows that

$$
\forall n \in \mathbb{N} : n \ge 3 \\
(a^n - (-b)^n) = (a+b) * \sum_{k=0}^{n-1} a^{(n-1)-k} * (-b)^k
$$

## Rational Exponent Binomial Expansion

When observing the theorem of binomial expansion

$$
(a+b)^n=\sum_{k=0}^{n} \binom{n}{k}*a^{(n-k)}*b^{k}
$$

it becomes apparent that whenever $a=1$, $a^{(n-k)}=1$, thereby resulting in

$$
(1+b)^n=\sum_{k=0}^{n} \binom{n}{k}*b^{k}
$$

The binomial coefficient $\binom{n}{k}$ by default only operates on natural numbers $\mathbb{N_{>0}}$, as both $n$ and $k$ are evaluated by the factorial function. When viewing it as an intermediate representation, and by cancelling the tail of $n!$, thereby turning the numerator into regular multiplication, there are no more roadblocks ahead to substitute rational numbers for $n$.

$$
\begin{align*}
\binom{n}{k} &= \frac{n!}{(n-k)! * k!} \\
&= \frac{n*(n-1)*(n-2)*\dotsm*\cancel{(n-k)!}}{\cancel{(n-k)!} * k!} \\
&= \frac{n*(n-1)*(n-2)*\dotsm*(n-(k-1))!}{k!} \\
&= \frac{\prod_{i=0}^{k-1}(n-i)}{k!} \\
\end{align*}
$$

When $k=0$, the following applies:

$$
\begin{align*}
\binom{n}{0} &= \frac{n!}{(n-k)! * k!} \\
&= \frac{\cancel{n!}}{\cancel{n!} * 0!} \\
&= \frac{\cancel{n!}}{\cancel{n!} * 1} \\
&= 1
\end{align*}
$$

The remaining product of terms within the numerator is called a falling factorial, which represents the beginning sequence of $n!$, with every term after $(n-k)$ cancelled out by $(n-k)!$ in the denominator. The product $(n-1)*(n-2)*\dotsm*(n-(k-1))$ is similar to binomial expansion, where the highest power of $n$ will be $k-1$ and the lowest will be $0$, just that the coefficients of the powers of $n$ are different, as the equivalent of $b$ in $(a+b)^n$ is no longer the same accross all parentheses, but rather a consequtive series of integers, starting at $1$. These coefficients are known as <a href="https://en.wikipedia.org/wiki/Stirling_numbers_of_the_first_kind" target="_blank">Stirling Numbers Of First Kind</a>, written down similarly to the binomial coefficient, but with brackets $n \brack k$.

$$
\prod_{i=0}^{k-1}(n-i) = \sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*n^i
$$

Substituting this product with its equivalent sum yields

$$
\begin{align*}
\binom{n}{k} &= \frac{\prod_{i=0}^{k-1}(n-i)}{k!} \\
&= \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*n^i}{k!} \\
\end{align*}
$$

For the reciprocal of $n$, the coefficient expands to

$$
\begin{align*}
\binom{\frac{1}{n}}{k} &= \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*(\frac{1}{n})^i}{k!} \\
&= \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{n^i}}{k!} \\
\end{align*}
$$

Thereby allowing for binomial expansion to the power of the reciprocal of $n$

$$
\begin{align*}
(1+b)^{\frac{1}{n}} &= 1 + \sum_{k=1}^{\infty} \binom{\frac{1}{n}}{k}*b^{k} \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{n^i}}{k!} * b^k \\
\end{align*}
$$

## The Exponential Function

The exponential function $e^x$ is a function whose derivative equals itself.

$$
\begin{align*}
f(x) &= a^x \\
f'(x) &= f(x) \\
&= \lim_{h \to 0}\left(\frac{f(x+h)-f(x)}{h}\right) \\
&= \lim_{h \to 0}\left(\frac{a^{x+h}-a^x}{h}\right) \\
&= \lim_{h \to 0}\left(\frac{a^x*(a^{h}-1)}{h}\right) \\
&= a^x * \lim_{h \to 0}\left(\frac{a^{h}-1}{h}\right) \\
&= f(x) * \lim_{h \to 0}\left(\frac{a^{h}-1}{h}\right)
\end{align*}
$$

For the above identity of $f(x) = f'(x)$ to hold, the limes needs to evaluate to a value of $1$.

$$
\begin{align*}
\frac{a^{h}-1}{h} &= 1 \\
a^{h}-1 &= h \\
a^{h} &= h + 1 \\
a &= \sqrt[h]{h + 1} \\
a &= \lim_{h \to 0}\left((h + 1)^{\frac{1}{h}}\right)
\end{align*}
$$

Lets call $a=e$, known as the natural number, or "Euler's Number". This constant is realized geometrically as the attempted measure of the ratio (red line segment : blue line segment).

<img src="/assets/images/new_calculus__9.png" class="half-width-image"/>

The function $e^x$ will end up as follows:

$$
\begin{align*}
e^x &= \lim_{h \to 0}\left(((h + 1)^{\frac{1}{h}})^x\right) \\
&= \lim_{h \to 0}\left((h + 1)^{\frac{x}{h}}\right) \\
\end{align*}
$$

Now, let $h = x*n$ and introduce the function $f(x,n)$:

$$
\begin{align*}
f(x,n) &= \lim_{h \to 0}\left((1 + x*n)^{\frac{\cancel{x}}{\cancel{x}*n}}\right) \\
&= \lim_{h \to 0}\left((1 + x*n)^{\frac{1}{n}}\right) \\
&= (1 + x*n)^{\frac{1}{n}}
\end{align*}
$$

Now, as $n \to 0$, $f(x,n) \to e^x$. As will be proven below, it is safe to set $n=0$ after [Rational Exponent Binomial Expansion](#rational-exponent-binomial-expansion), as no occurrence of $n$ will remain in any denominator.

$$
\begin{align*}
f(x,n) &= (1+x*n)^{\frac{1}{n}} \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{n^i}}{k!} * (x*n)^k \\
&= 1 + \sum_{k=1}^{\infty} \frac{n^k*\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*\frac{1}{n^i}}{k!} * x^k \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*n^k*\frac{1}{n^i}}{k!} * x^k \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-1)^{k-i}*n^{k-i}}{k!} * x^k \\
&= 1 + \sum_{k=1}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-n)^{k-i}}{k!} * x^k \\
&= 1 + x + \sum_{k=2}^{\infty} \frac{\sum_{i=1}^{k}{k \brack i}*(-n)^{k-i}}{k!} * x^k \\
&= 1 + x + \sum_{k=2}^{\infty} \frac{1 + \sum_{i=1}^{k - 1}{k \brack i}*(-n)^{k-i}}{k!} * x^k \\
&= 1 + x + \sum_{k=2}^{\infty} \left(\frac{x^k}{k!} + \frac{x^k*\sum_{i=1}^{k - 1}{k \brack i}*(-n)^{k-i}}{k!}\right) \\
\end{align*}
$$

But $e^x = f(x,0)$, so

$$
\begin{align*}
f(x,0) &= 1 + x + \sum_{k=2}^{\infty} \frac{x^k}{k!} \\
&= 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dotsm
\end{align*}
$$

and $e^1 = f(1,0)$, so

$$
\begin{align*}
e &= 1 + x + \sum_{k=2}^{\infty} \frac{1^k}{k!} \\
&= 1 + 1 + \frac{1}{2!} + \frac{1}{3!} + \dotsm
\end{align*}
$$