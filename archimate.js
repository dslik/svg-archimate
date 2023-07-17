// -------------------------------------------------------------------------------------
// FIXME - Add library and method documentation here once code is firming up
// ----------------------------------------------------------------------------------------
"use strict";

// Convenience function that creates an SVG element from type, value and text strings
function svgen(n, v, t) {
    n = document.createElementNS("http://www.w3.org/2000/svg", n);
    for (var p in v)
        if(p == "xlink:href") { n.setAttributeNS("http://www.w3.org/1999/xlink", p, v[p]); }
        else if(p == "xmlns:xlink") { n.setAttributeNS("http://www.w3.org/2000/xmlns/", p, v[p]); }
        else if(p == "xmlns") { n.setAttributeNS("http://www.w3.org/2000/xmlns/", p, v[p]); }
        else if(p == "xml:space") { n.setAttributeNS("http://www.w3.org/XML/1998/namespace", p, v[p]); }
        else { n.setAttributeNS(null, p, v[p]); }
    if(t) n.innerHTML = t;
    return n;
}

// Define supported ArchiMate elements
class element {
    // Create new instances of the same class as static attributes
    static businessObject = new element("businessObject")
    static dataObject = new element("dataObject")
    static applicationComponent = new element("applicationComponent")
    static node = new element("node")

    constructor(name) {
       this.name = name
   }
}

class archiMateDiagram {
    constructor(svg) {
        this.svg = svg;

        // Get size of SVG
        this.width = svg.getAttribute("width");
        this.height = svg.getAttribute("height");

        // Default grid
        this.gridX = 20;
        this.gridY = 20;

        this.elementWidth = 160;
        this.elementHeight = 80;

        this.elements = new Array();
    }

    setGrid(xDim, yDim) {
        this.gridX = xDim;
        this.gridY = yDim;
    }

    addGridlines() {
        // Figure out max grid size
        var maxwidth = (this.width - (this.gridX * 2));
        maxwidth = maxwidth - maxwidth % this.gridX

        var maxheight = (this.height - (this.gridY * 2));
        maxheight = maxheight - maxheight % this.gridY

        var xSquares = maxwidth / this.gridX;
        var ySquares = maxheight / this.gridY;

        const xStart = this.gridX;
        const xEnd = this.gridX + maxwidth;
        const yStart = this.gridY;
        const yEnd = this.gridY + maxheight;

        // Draw x-axis grid lines
        var counter = 0;

        while(counter <= ySquares)
        {
            svg.appendChild(svgen("line", { x1: xStart,
                                            y1: yStart + (this.gridY * counter),
                                            x2: xEnd,
                                            y2: yStart + (this.gridY * counter),
                                            stroke: "#EEEEEE"}));

            counter = counter + 1;
        }

        // Draw y-axis grid lines
        var counter = 0;

        while(counter <= xSquares)
        {
            svg.appendChild(svgen("line", { x1: xStart + (this.gridX * counter),
                                            y1: yStart,
                                            x2: xStart + (this.gridX * counter),
                                            y2: yEnd,
                                            stroke: "#EEEEEE"}));

            counter = counter + 1;
        }

        // Draw element x-axis grid lines
        var maxElementsX = (this.width - (this.gridX * 2));
        maxElementsX = maxElementsX - maxElementsX % (this.elementWidth + this.gridX * 8);

        var maxElementsY = (this.height - (this.gridY * 2));
        maxElementsY = maxElementsY - maxElementsY % (this.elementHeight + this.gridY * 8);

        var xElements = maxElementsX / (this.elementWidth + this.gridX * 8);
        var yElements = maxElementsY / (this.elementHeight + this.gridY * 8);

        // Draw x-axis element lines
        var counter = 0;

        while(counter <= yElements)
        {
            svg.appendChild(svgen("line", { x1: xStart,
                                            y1: yStart + ((this.elementHeight + this.gridY * 8) * counter),
                                            x2: xEnd,
                                            y2: yStart + ((this.elementHeight + this.gridY * 8) * counter),
                                            stroke: "#AAAAAA"}));

            counter = counter + 1;
        }

        // Draw element y-axis grid lines
        var counter = 0;

        while(counter <= xElements)
        {
            svg.appendChild(svgen("line", { x1: xStart + ((this.elementWidth + this.gridX * 8) * counter),
                                            y1: yStart,
                                            x2: xStart + ((this.elementWidth + this.gridX * 8) * counter),
                                            y2: yEnd,
                                            stroke: "#AAAAAA"}));

            counter = counter + 1;
        }

    }

    addElement(x, y, layer, spanX, spanY, elementType, label) {
        let layerOffset = 4;
        let layerWidth = 0;
        let layerHeight = 0;
        let textAnchor = "middle"

        if(layer == 1)
        {
            layerOffset = 2;
            layerWidth = 4 * this.gridX;
            layerHeight = 4 * this.gridY;
            textAnchor = "start"
        }

        if(layer == 2)
        {
            layerOffset = 0;
            layerWidth = 8 * this.gridX;
            layerHeight = 8 * this.gridY;
            textAnchor = "start"
        }

        let totalWidth = (this.elementWidth + layerWidth) * spanX + ((spanX - 1) * this.gridX * 2 * layerOffset);
        let totalHeight = (this.elementHeight + layerHeight) * spanY + ((spanY - 1) * this.gridY * 2 * layerOffset);
        let xPos = this.gridX * (layerOffset + 1) + (x * (this.elementWidth + 8 * this.gridX));
        let yPos = this.gridY * (layerOffset + 1) + (y * (this.elementHeight + 8 * this.gridY));

        var group = svgen('g', {transform:"translate(" + xPos.toString() + " " + yPos.toString() + ")" });
    
        var fillColor = "#FFFFFF";

        if(elementType.name.startsWith("application") || elementType.name == "dataObject")
        {
            fillColor = "#AEFEFE";
        }

        if(elementType.name.startsWith("business") || elementType.name == "contract" || elementType.name == "representation" || elementType.name == "product")
        {
            fillColor = "#FEF7AE";
        }

        if(elementType.name.startsWith("technology") ||
           elementType.name == "facility" ||
           elementType.name == "equipment" ||
           elementType.name == "material" ||
           elementType.name == "node" ||
           elementType.name == "device" ||
           elementType.name == "systemSoftware" ||
           elementType.name == "artifact" ||
           elementType.name == "communicationNetwork" ||
           elementType.name == "path" ||
           elementType.name == "distirbutionNetwork")
        {
            fillColor = "#AEF8AF";
        }

        group.appendChild(svgen("rect", { x: 0,
                                          y: 0,
                                          width: totalWidth,
                                          height: totalHeight,
                                          stroke: "#000000",
                                          fill: fillColor }));

        var icon = svgen('g', {transform:"translate(" + totalWidth + " " + 0 + ")", stroke: "#000000", "stroke-width": 0.75, fill: fillColor  });

        if(elementType.name == "applicationComponent")
        {
            icon.appendChild(svgen("rect", { x: -17, y: 0 + 5, width: 12, height: 12, }));
            icon.appendChild(svgen("rect", { x: -20, y: 0 + 7, width: 6, height: 3 }));
            icon.appendChild(svgen("rect", { x: -20, y: 0 + 12, width: 6, height: 3 }));
        }

        if(elementType.name == "dataObject" || elementType.name == "businessObject")
        {
            icon.appendChild(svgen("rect", { x: -20, y: 0 + 5, width: 15, height: 12 }));
            icon.appendChild(svgen("rect", { x: -20,  y: 0 + 5, width: 15, height: 3 }));
        }

        if(elementType.name == "node")
        {
            // Front box
            icon.appendChild(svgen("rect", { x: -21, y: 8, width: 12, height: 12 }));

            // Top left line
            icon.appendChild(svgen("line", { x1: -21, y1: 8, x2: -16, y2: 5 }));

            // Top right line
            icon.appendChild(svgen("line", { x1: -9, y1: 8, x2: -5, y2: 5 }));

            // Top connecting line
            icon.appendChild(svgen("line", { x1: -16, y1: 5, x2: -5, y2: 5 }));

            // Bottom right line
            icon.appendChild(svgen("line", { x1: -9, y1: 20, x2: -5, y2: 17 }));

            // Left connecting line
            icon.appendChild(svgen("line", { x1: -5, y1: 5, x2: -5, y2: 17 }));
        }

        group.appendChild(icon);

        var textWidth = getTextWidth(label, '20px sans-serif');
        var textX = totalWidth / 2;
        var textY = totalHeight / 2;

        if(textAnchor == "start")
        {
            textX = 5;
            textY = 15;
        }

        if(textWidth >= totalWidth)
        {
            if(textWidth >= totalWidth * 2)
            {
                // Wrap text into three lines
            }
            else
            {
                // Wrap text into two lines
                let counter = 0;
                const center = (label.length / 2) - (label.length / 2) % 2;
                var split = 0;

                while(counter < center && split == 0)
                {
                    if(label[center - counter] == ' ')
                    {
                        split = center - counter;
                    }
                    else
                    {
                        if(label[center + counter] == ' ')
                        {
                            split = center + counter;
                        }
                    }

                    counter = counter + 1;
                }

                var line1;
                var line2;

                if(split == 0)
                {
                    var line1 = label.substring(0, center);
                    var line2 = label.substring(center, label.length);
                }
                else
                {
                    var line1 = label.substring(0, split);
                    var line2 = label.substring(split + 1, label.length);
                }

                group.appendChild(svgen('text', { x: textX,
                                                y: textY - 7,
                                                "text-anchor": textAnchor,
                                                "font-size": 20,
                                                "font-family": "sans-serif" }, line1));

                group.appendChild(svgen('text', { x: textX,
                                                y: textY + 17,
                                                "text-anchor": textAnchor,
                                                "font-size": 20,
                                                "font-family": "sans-serif" }, line2));
            }
        }
        else
        {
            group.appendChild(svgen('text', { x: textX,
                                            y: textY + 20 / 3,
                                            "text-anchor": textAnchor,
                                            "font-size": 20,
                                            "font-family": "sans-serif" }, label));
        }

        svg.appendChild(group)
    }
}


// From https://stackoverflow.com/questions/19248686/
const getTextWidth = (text, font) => {
  const element = document.createElement('canvas');
  const context = element.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
}

