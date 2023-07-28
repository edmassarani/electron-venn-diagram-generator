# Venn Diagram Generator in Electron

This repo is meant to be a rework of my other venn diagram generator built using Eel (Python) & Vue.js.

I tried making it using only Javascript, but the problem is that there is very little support when it comes to data science stuff when compared to Python.

Reading CSVs, comparing data and generating diagrams proved to be way bigger a challenge than I was expecting.

In the end, I managed to reproduce the code CSV read/compare part but although it was more performant than the python version, the diagram generation was limited to only 2-3 sources.

I will keep this repo as a reference for future projects where I want to build electron apps with Vite and Vue. But the original Python version of this serves its purpose better (even though it is quite slow).
