# SLA PCB Exposure

## Introduction

I recently got a good deal on a used *Elegoo Saturn 2 8K* SLA 3D-printer. At the moment of writing this, the device sells for around 400 euros brandnew, while I got mine for 220 euros used, in good and working condition.

<img src="/img/sla_pcb_exposure__1.jpg" class="third-width-image"/>

To be honest, I'm not (yet) into 3D printing, and thus haven't bought the printer for that reason. I saw another, in my opinion hugely underestimated, capability of this printer, which comes into existence due to the fact that it has a monochrome 8K LCD built into it, right above a Fresnel lens, bundled with a UV light source. This *screams* PCB fabrication to me.

Here are the display's specifications:

```
7680x4320px
218.88x123.12mm
891.23 dpi
28.5µm/pixel
```

I've seen $.15\mathrm{mm}$ traces done successfully with less pixels, so I have good reasons to believe that this could be the holy grail of rapid prototyping at home.

## Repeatable Alignment

When 3D-printing, a bath of resin is required, from which the structure can be incrementally built out of, layer by layer. This is what the container looks like out of the factory:

<img src="/img/sla_pcb_exposure__2.jpg" class="half-width-image"/>

<img src="/img/sla_pcb_exposure__3.jpg" class="half-width-image"/>

This container does not align with the outermost pixels of the display, which is why I would have to either leave this part of the PCB unexposed, or add shims. Both ways are not a realistic option for me, which is why I've decided to build my own alignment jig. For this, I've used only remaining parts I had lying around, some of which came from my [Customizable Tool Wall](./customizable_tool_wall.md).

The first step was to add the following two parallel vertical rails, onto which I can then variably mount the two horizontal stops.

<img src="/img/sla_pcb_exposure__4.jpg" class="half-width-image"/>

<img src="/img/sla_pcb_exposure__5.jpg" class="half-width-image"/>

Now I only need a way to connect these aluminium profiles together, while still leaving some freedom for adjustments.

<img src="/img/sla_pcb_exposure__6.jpg" class="half-width-image"/>

For this exact purpose, I've made some slotted pices of flat aluminium:

<img src="/img/sla_pcb_exposure__7.jpg" class="half-width-image"/>

<img src="/img/sla_pcb_exposure__8.jpg" class="half-width-image"/>

Just three more...

<img src="/img/sla_pcb_exposure__9.jpg" class="half-width-image"/>

Through these, I can join the rails and adjust their distance if ever required.

<img src="/img/sla_pcb_exposure__10.jpg" class="half-width-image"/>

The right-angle profile is joined to the c-profile by two M3 screws, for which I've drilled the holes at $3.2\mathrm{mm}$. This way, I've got approximately $\pm\frac{1}{10}\mathrm{mm}$ of play, both upwards and downwards. I've adjusted them so that the aluminium rails are slightly suspended above the LCD, and thus excert zero force onto it. A little post-it will slide just through the gap, but a PCB won't:

<img src="/img/sla_pcb_exposure__11.jpg" class="half-width-image"/>

If I ever need to 3D-print something, the whole thing comes off with just the two M4 screws on the right-angle profiles' slots and stays rigidly calibrated.

<img src="/img/sla_pcb_exposure__12.jpg" class="half-width-image"/>

## Projecting A Layout

The mainboards of these printers, along with their firmware, have been designed by `ChiTu Systems!`, which went above and beyond to make sure that their product is as locked down as possible. There is no straight-forward way to project a bitmap onto the built-in LCD, as the printer seems to only accept `.ctb` files, which are the result of slicing a 3D-Model with the `Chitubox` software.

This means that I need to extrude my bitmap into a 3D STL to then slice it into layers, so that the printer accepts the data. What a time to be alive! If this whole idea pans out, I'm going to try to come up with a proper solution for this tedious process.

// TODO: Go into the details of the process

## Exposure Time

// TODO: Conduct experiments to approximate the right exposure duration

// TODO: Showcase first results