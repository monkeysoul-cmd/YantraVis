# **App Name**: YantraVis

## Core Features:

- Location Input: Accept latitude and longitude input to define the construction site.
- Yantra Selection: Allow the user to select from a list of traditional Indian yantras (Samrat, Rama, Jai-Prakash, Rasivalaya, etc.).
- Dimension Calculation: Calculate the geometric dimensions and orientation of the selected yantra based on the input location using established astronomy libraries and geometric formulas. The NREL's SPA, Skyfield, or pvlib tools will be incorporated to assist with calculations.
- 3D Model Generation: Generate a 3D model of the yantra with calculated dimensions for visualization purposes.
- CAD Export: Allow the user to export the yantra dimensions in CAD-compatible formats (e.g., DXF, STL).
- Visual Preview: Display a visual preview of the yantra model, including its alignment with respect to true north (using NOAA/WMM API).
- Augmented Reality Preview: Enable an AR mode that allows users to preview the Yantra at the specified coordinates by using geolocation, device orientation, and camera to allow AR placement on a live camera feed.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to represent the depth of astronomical knowledge.
- Background color: Light Lavender (#E6E6FA) for a soft, calming backdrop that does not distract from the 3D models.
- Accent color: Gold (#FFD700) to highlight key interactive elements, like the active Yantra.
- Body font: 'PT Sans', a versatile humanist sans-serif font for a blend of modern clarity and accessibility for descriptions and labels.
- Headline font: 'Playfair', a stylish modern sans-serif with an elegant feel that creates emphasis without overwhelming body text.
- Use clear, minimalist icons to represent different yantras and functions within the application.
- Implement a clean and intuitive layout with a focus on easy navigation and data input.