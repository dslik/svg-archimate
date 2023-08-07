// -------------------------------------------------------------------------------------
// FIXME - Add library and method documentation here once code is firming up
// ----------------------------------------------------------------------------------------
"use strict";

// ----------------------------------------------------------------------------------------
// ArchiMate elements
class element {
    // Core Elements Column 1
    static location = new element("location", "#FFAA55");
    static businessActor = new element("businessActor", "#FEF7AE");
    static businessRole = new element("businessRole", "#FEF7AE");
    static businessCollaboration = new element("businessCollaboration", "#FEF7AE");
    static businessInterface = new element("businessInterface", "#FEF7AE");
    static businessProcess = new element("businessProcess", "#FEF7AE", true);
    static businessFunction = new element("businessFunction", "#FEF7AE", true);
    static businessInteraction = new element("businessInteraction", "#FEF7AE", true);
    static businessService = new element("businessService", "#FEF7AE", true);
    static businessEvent = new element("businessEvent", "#FEF7AE", true);
    static businessObject = new element("businessObject", "#FEF7AE");
    static contract = new element("contract", "#FEF7AE");
    static representation = new element("representation", "#FEF7AE");
    static product = new element("product", "#FEF7AE");

    // Core Elements Column 2
    static grouping = new element("grouping", "#FFFFFF");
    static applicationComponent = new element("applicationComponent", "#AEFEFE");
    static applicationCollaboration = new element("applicationCollaboration", "#AEFEFE");
    static applicationInterface = new element("applicationInterface", "#AEFEFE");
    static applicationProcess = new element("applicationProcess", "#AEFEFE", true);
    static applicationFunction = new element("applicationFunction", "#AEFEFE", true);
    static applicationInteraction = new element("applicationInteraction", "#AEFEFE", true);
    static applicationService = new element("applicationService", "#AEFEFE", true);
    static applicationEvent = new element("applicationEvent", "#AEFEFE", true);
    static dataObject = new element("dataObject", "#AEFEFE");
    static facility = new element("facility", "#AEF8AF");
    static equipment = new element("equipment", "#AEF8AF");
    static material = new element("material", "#AEF8AF");

    // Core Elements Column 3
    static node = new element("node", "#AEF8AF");
    static device = new element("device", "#AEF8AF");
    static systemSoftware = new element("systemSoftware", "#AEF8AF");
    static technologyCollaberation = new element("technologyCollaberation", "#AEF8AF");
    static technologyInterface = new element("technologyInterface", "#AEF8AF");
    static technologyProcess = new element("technologyProcess", "#AEF8AF", true);
    static technologyFunction = new element("technologyFunction", "#AEF8AF", true);
    static technologyInteraction = new element("technologyInteraction", "#AEF8AF", true);
    static technologyService = new element("technologyService", "#AEF8AF", true);
    static technologyEvent = new element("technologyEvent", "#AEF8AF", true);
    static artifact = new element("artifact", "#AEF8AF");
    static communicationNetwork = new element("communicationNetwork", "#AEF8AF");
    static path = new element("path", "#AEF8AF");
    static distributionNetwork = new element("distributionNetwork", "#AEF8AF");

    constructor(name, colour, rounded = false) {
       this.name = name;
       this.colour = colour;
       this.rounded = rounded;
   }
}

class archiMateElement {
    constructor(label, elementType, x, y) {
        this.label = label;
        this.elementType = elementType;

        this.x = x;
        this.y = y;

        this.layer = 0;

        this.spanX = 1;
        this.spanY = 1;

        this.padding = 5;
    }

    addElement(label, elementType, x, y) {
        var newElement = this.diagram.addElement(label, elementType, this.x + x, this.y + y);
        if(this.layer == newElement.layer)
        {
            this.layer = this.layer + 1;
        }

        if(this.spanX < x + 1)
        {
            this.spanX = x + 1;
        }

        if(this.spanY < y + 1)
        {
            this.spanY = y + 1;
        }
    }
}

// ----------------------------------------------------------------------------------------
// ArchiMate relationships
class relationship {
    // Create new instances of the same class as static attributes
    static composition = new relationship("composition");
    static serving = new relationship("serving");
    static access = new relationship("access");

    constructor(name) {
       this.name = name;
   }
}

class archiMateRelationship {
    constructor(label, firstElement, secondElement, relationshipType) {
        this.label = label;
        this.relationshipType = relationshipType;

        this.firstElement = firstElement;
        this.secondElement = secondElement;
    }
}

// ----------------------------------------------------------------------------------------
// ArchiMate diagrams
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
        this.relationships = new Array();
    }

    addElement(label, elementType, x, y) {
        var element = new archiMateElement(label, elementType, x, y);
        element.diagram = this;
        element.layer = 0;

        this.elements.push(element);
        return(element);
    }

    addRelationship(label, first, second, type) {
        var firstElement = this.getElementByLabel(first);
        var secondElement = this.getElementByLabel(second);

        if(firstElement && secondElement) {
            var relationship = new archiMateRelationship(label, firstElement, secondElement, type);
            this.relationships.push(relationship);
        }
    }

    addGridlines(xDim = this.gridX, yDim = this.gridY) {
        this.gridLines = true;
        this.gridX = xDim;
        this.gridY = yDim;
    }

    getElementByLabel(label) {
        var foundElement;

        this.elements.forEach((element) => {
            if(element.label == label)
            {
                foundElement = element;
            }
        });

        return(foundElement);
    }

    render()
    {
        this.#drawGridLines();
        this.#drawElements();
        this.#drawRelationships();
    }

    #drawGridLines()
    {
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

    #drawElements() {
        this.elements.forEach((element) => {
            if(element.layer == 2)
            {
                this.#drawElement(element);
            }
        });

        this.elements.forEach((element) => {
            if(element.layer == 1)
            {
                this.#drawElement(element);
            }
        });

        this.elements.forEach((element) => {
            if(element.layer == 0)
            {
                this.#drawElement(element);
            }
        });
    }

    #drawRelationships() {
        this.relationships.forEach((relationship) => {
            this.#drawRelationship(relationship);
        });
    }

    #getElementBBox(element) {
        let layer = element.layer;
        let spanX = element.spanX;
        let spanY = element.spanY;

        let layerOffset = 4;
        let layerWidth = 0;
        let layerHeight = 0;

        if(layer == 1)
        {
            layerOffset = 2;
            layerWidth = 4 * this.gridX;
            layerHeight = 4 * this.gridY;
        }

        if(layer == 2)
        {
            layerOffset = 0;
            layerWidth = 8 * this.gridX;
            layerHeight = 8 * this.gridY;
        }

        let totalWidth = (this.elementWidth + layerWidth) * spanX + ((spanX - 1) * this.gridX * 2 * layerOffset);
        let totalHeight = (this.elementHeight + layerHeight) * spanY + ((spanY - 1) * this.gridY * 2 * layerOffset);
        let xPos = this.gridX * (layerOffset + 1) + (element.x * (this.elementWidth + 8 * this.gridX));
        let yPos = this.gridY * (layerOffset + 1) + (element.y * (this.elementHeight + 8 * this.gridY));

        return(new DOMRect(xPos, yPos, totalWidth, totalHeight));
    }

    #drawElement(element) {
        let elementType = element.elementType;
        let layer = element.layer;
        let spanX = element.spanX;
        let spanY = element.spanY;

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
        let xPos = this.gridX * (layerOffset + 1) + (element.x * (this.elementWidth + 8 * this.gridX));
        let yPos = this.gridY * (layerOffset + 1) + (element.y * (this.elementHeight + 8 * this.gridY));

        var group = svgen('g', {transform:"translate(" + xPos.toString() + " " + yPos.toString() + ")" });
    
        var fillColor = elementType.colour;

        if(elementType.name == "grouping")
        {
                group.appendChild(svgen("rect", { x: 0,
                                                  y: 0,
                                                  width: totalWidth,
                                                  height: totalHeight,
                                                  stroke: "#000000",
                                                  fill: fillColor,
                                                  "stroke-dasharray": "6,2" }));
        }
        else
        {
            if(elementType.rounded == false)
            {
                group.appendChild(svgen("rect", { x: 0,
                                                  y: 0,
                                                  width: totalWidth,
                                                  height: totalHeight,
                                                  stroke: "#000000",
                                                  fill: fillColor }));
            }
            else
            {
                group.appendChild(svgen("rect", { x: 0,
                                                  y: 0,
                                                  rx: 14,
                                                  width: totalWidth,
                                                  height: totalHeight,
                                                  stroke: "#000000",
                                                  fill: fillColor }));
            }
        }

        group.appendChild(this.#drawIcon(elementType, totalWidth, fillColor));

        var textWidth = getTextWidth(element.label, '20px sans-serif');
        var textX = totalWidth / 2;
        var textY = totalHeight / 2;

        if(textAnchor == "start")
        {
            textX = 5;
            textY = 15;
        }

        if(textWidth >= totalWidth - element.padding)
        {
            if(textWidth >= totalWidth * 2)
            {
                // Wrap text into three lines
            }
            else
            {
                // Wrap text into two lines
                let counter = 0;
                const center = (element.label.length / 2) - (element.label.length / 2) % 2;
                var split = 0;

                while(counter < center && split == 0)
                {
                    if(element.label[center - counter] == ' ')
                    {
                        split = center - counter;
                    }
                    else
                    {
                        if(element.label[center + counter] == ' ')
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
                    var line1 = element.label.substring(0, center);
                    var line2 = element.label.substring(center, element.label.length);
                }
                else
                {
                    var line1 = element.label.substring(0, split);
                    var line2 = element.label.substring(split + 1, element.label.length);
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
                                            "font-family": "sans-serif" }, element.label));
        }

        svg.appendChild(group)        
    }

    #drawRelationship(rel) {
        var firstBBox = this.#getElementBBox(rel.firstElement);
        var secondBBox = this.#getElementBBox(rel.secondElement);

        // Determine the orientation of the source and destination
        var startCentreX = firstBBox.x + firstBBox.width / 2;
        var startCentreY = firstBBox.y + firstBBox.height / 2;
        var endCentreX = secondBBox.x + secondBBox.width / 2;
        var endCentreY = secondBBox.y + secondBBox.height / 2;

        var xDirection;
        var yDirection;
        var angle = 0;
        var startX = startCentreX;
        var startY = startCentreY;
        var endX = endCentreX;
        var endY = endCentreY;

        if(startCentreX < endCentreX)
        {
            xDirection = "right";

            if(firstBBox.y >= secondBBox.y && firstBBox.y + firstBBox.height <= secondBBox.y + secondBBox.height)
            {
                startX = firstBBox.x + firstBBox.width;
                startY = startCentreY;
                endX = secondBBox.x;
                endY = startCentreY;

            }

            angle = 0;
        }
        else
        {
            if(startCentreX > endCentreX)
            {
                xDirection = "left";

                if(secondBBox.y >= firstBBox.y && secondBBox.y + secondBBox.height <= firstBBox.y + firstBBox.height)
                {
                    startX = firstBBox.x;
                    startY = endCentreY;
                    endX = secondBBox.x + secondBBox.width;
                    endY = endCentreY;
                }

                angle = 180;
            }
            else
            {
                if(startCentreY < endCentreY)
                {
                    yDirection = "down";

                    startX = startCentreX;
                    startY = firstBBox.y + firstBBox.height;
                    endX = endCentreX;
                    endY = secondBBox.y;

                    angle = 90;
                }
                else
                {
                    yDirection = "up";
                }
            }
        }

        if(rel.relationshipType.name == "access")
        {
            this.svg.appendChild(svgen("line", { x1: startX,
                            y1: startY,
                            x2: endX,
                            y2: endY,
                            stroke: "#000000",
                            "stroke-width": 2,
                            "stroke-dasharray": "2,2" })); 
        }
        else
        {
            this.svg.appendChild(svgen("line", { x1: startX,
                            y1: startY,
                            x2: endX,
                            y2: endY,
                            stroke: "#000000",
                            "stroke-width": 2 })); 
        }

        // Draw arrow
        this.svg.appendChild(this.#drawArrow(endX, endY, angle, rel.relationshipType));
   }

    #drawArrow(x, y, angle, relType) {
        var arrowHead = svgen('g', {transform:"translate(" + x.toString() + " " + y.toString() + ") rotate(" + angle.toString() + " 0 0)", stroke: "#000000", "stroke-width": 1, fill: "none" });

        if(relType.name == "serving")
        {
            arrowHead.appendChild(svgen("line", { x1: 0, y1: 0, x2: -15, y2: -7 }));
            arrowHead.appendChild(svgen("line", { x1: 0, y1: 0, x2: -15, y2: 7 }));
        }

        if(relType.name == "composition")
        {
            arrowHead.appendChild(svgen("polyline", { points: "0,0 -15,-7 -30,0 -15,7 0,0", fill: "#000000" }));
        }

        if(relType.name == "access")
        {
            arrowHead.appendChild(svgen("line", { x1: 0, y1: 0, x2: -10, y2: -5 }));
            arrowHead.appendChild(svgen("line", { x1: 0, y1: 0, x2: -10, y2: 5 }));
        }

        return(arrowHead);
    }

    #drawIcon(elementType, width, fillColor) {
        var icon = svgen('g', {transform:"translate(" + width + " " + 0 + ")", stroke: "#000000", "stroke-width": 0.75, fill: fillColor });

        switch(elementType.name) {
            case "location":
                icon.appendChild(svgen("path", { d: "M -15 13 C -15 5, -5 5, -5 13 C -5 17, -7 16, -10 22 C -13 16, -15 17, -15 13 "}));
                break;
            case "businessActor":
                icon.appendChild(svgen("circle", { cx: -10, cy: 10, r: 5 }));
                icon.appendChild(svgen("line", { x1: -10, y1: 15, x2: -10, y2: 20, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -17, y1: 17, x2: -3, y2: 17, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -10, y1: 20, x2: -17, y2: 25, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -10, y1: 20, x2: -3, y2: 25, "stroke-width": 1.3 }));
                break;
            case "businessRole":
                icon.appendChild(svgen("path", { d: "M -7 5 L -15 5 C -20 5, -20 15, -15 15 L -7 15 "}));
                icon.appendChild(svgen("ellipse", { cx: -7, cy: 10, rx: 3, ry: 5 }));
                break;
            case "businessCollaboration":
            case "applicationCollaboration":
            case "technologyCollaberation":
                icon.appendChild(svgen("circle", { cx: -18, cy: 12, r: 7, fill: "none" }));
                icon.appendChild(svgen("circle", { cx: -12, cy: 12, r: 7, fill: "none" }));
                break;
            case "systemSoftware":
                icon.appendChild(svgen("circle", { cx: -12, cy: 12, r: 7 }));
                icon.appendChild(svgen("circle", { cx: -15, cy: 15, r: 7 }));
                break;
            case "businessInterface":
            case "applicationInterface":
            case "technologyInterface":
                icon.appendChild(svgen("circle", { cx: -14, cy: 13, r: 8 }));
                icon.appendChild(svgen("line", { x1: -32, y1: 13, x2: -22, y2: 13 }));
                break;
            case "businessProcess":
            case "applicationProcess":
            case "technologyProcess":
                icon.appendChild(svgen("polyline", { points: "-6,12 -12,6 -12,10 -24,10 -24,14 -12,14 -12,18 -6,12"}));
                break;
            case "businessFunction":
            case "applicationFunction":
            case "technologyFunction":
                icon.appendChild(svgen("polyline", { points: "-14,6 -6,12 -6,20 -14,14 -22,20 -22,12 -14,6"}));
                break;
            case "businessInteraction":
            case "applicationInteraction":
            case "technologyInteraction":
                icon.appendChild(svgen("path", { d: "M -15 5 C -23 5, -23 15, -15 15 Z "}));
                icon.appendChild(svgen("path", { d: "M -13 5 C -5 5, -5 15, -13 15 Z "}));
                break;
            case "businessService":
            case "applicationService":
            case "technologyService":
                icon.appendChild(svgen("rect", { x: -24, y: 5, width: 18, height: 12, rx: 5}));
                break;
            case "businessEvent":
            case "applicationEvent":
            case "technologyEvent":
                icon.appendChild(svgen("path", { d: "M -13 5 C -5 5, -5 15, -13 15 L -23 15 L -20 10 L -23 5 Z "}));
                break;
            case "applicationComponent":
                icon.appendChild(svgen("rect", { x: -17, y: 5, width: 12, height: 12, }));
                icon.appendChild(svgen("rect", { x: -20, y: 7, width: 6, height: 3 }));
                icon.appendChild(svgen("rect", { x: -20, y: 12, width: 6, height: 3 }));
                break;
            case "artifact":
                icon.appendChild(svgen("path", { d: "M -9 5 L -20 5 L -20 16 L -5 16 L -5 9 L -9 5 L -9 9 L -5 9 "}));
                break;
            case "facility":
                icon.appendChild(svgen("path", { d: "M -22 20 L -22 5 L -19 5 L -19 14 L -14 10 L -14 14 L -9 10 L -9 14 L -4 10 L -4 20 Z"}));
                break;
            case "dataObject":
            case "businessObject":
                icon.appendChild(svgen("rect", { x: -20, y: 5, width: 15, height: 12 }));
                icon.appendChild(svgen("rect", { x: -20,  y: 5, width: 15, height: 3 }));
                break;
            case "contract":
                icon.appendChild(svgen("rect", { x: -20, y: 5, width: 15, height: 12 }));
                icon.appendChild(svgen("rect", { x: -20,  y: 5, width: 15, height: 3 }));
                icon.appendChild(svgen("rect", { x: -20,  y: 14, width: 15, height: 3 }));
                break;
            case "product":
                icon.appendChild(svgen("rect", { x: -20, y: 5, width: 15, height: 12 }));
                icon.appendChild(svgen("rect", { x: -20,  y: 5, width: 7, height: 3 }));
                break;
            case "grouping":
                icon.appendChild(svgen("line", { x1: -20, y1: 5, x2: -9, y2: 5, "stroke-dasharray": "2,1" }));
                icon.appendChild(svgen("line", { x1: -20, y1: 5, x2: -20, y2: 8, "stroke-dasharray": "2,1" }));
                icon.appendChild(svgen("line", { x1: -9, y1: 5, x2: -9, y2: 8, "stroke-dasharray": "2,1" }));
                icon.appendChild(svgen("rect", { x: -20, y: 8, width: 15, height: 9, "stroke-dasharray": "2,1" }));
                break;
            case "node":
                icon.appendChild(svgen("rect", { x: -21, y: 8, width: 12, height: 12 }));   // Front box
                icon.appendChild(svgen("line", { x1: -21, y1: 8, x2: -16, y2: 5 }));        // Top left line
                icon.appendChild(svgen("line", { x1: -9, y1: 8, x2: -5, y2: 5 }));          // Top right line
                icon.appendChild(svgen("line", { x1: -16, y1: 5, x2: -5, y2: 5 }));         // Top connecting line
                icon.appendChild(svgen("line", { x1: -9, y1: 20, x2: -5, y2: 17 }));        // Bottom right line
                icon.appendChild(svgen("line", { x1: -5, y1: 5, x2: -5, y2: 17 }));         // Left connecting line
                break;
            case "device":
                icon.appendChild(svgen("rect", { x: -24, y: 5, width: 18, height: 12, rx: 2}));
                icon.appendChild(svgen("line", { x1: -21, y1: 17, x2: -24, y2: 20 }));
                icon.appendChild(svgen("line", { x1: -24, y1: 20, x2: -6, y2: 20 }));
                icon.appendChild(svgen("line", { x1: -9, y1: 17, x2: -6, y2: 20 }));
                break;
            case "communicationNetwork":
                icon.appendChild(svgen("circle", { cx: -7, cy: 7, r: 2, fill: "#000000" }));
                icon.appendChild(svgen("line", { x1: -7, y1: 7, x2: -14, y2: 7 }));
                icon.appendChild(svgen("circle", { cx: -14, cy: 7, r: 2, fill: "#000000" }));
                icon.appendChild(svgen("line", { x1: -14, y1: 7, x2: -17, y2: 14 }));
                icon.appendChild(svgen("circle", { cx: -17, cy: 14, r: 2, fill: "#000000" }));
                icon.appendChild(svgen("line", { x1: -17, y1: 14, x2: -10, y2: 14 }));
                icon.appendChild(svgen("circle", { cx: -10, cy: 14, r: 2, fill: "#000000" }));
                icon.appendChild(svgen("line", { x1: -10, y1: 14, x2: -7, y2: 7 }));
                break;
            case "path":
                icon.appendChild(svgen("line", { x1: -5, y1: 10, x2: -10, y2: 5, "stroke-width": 1.5 }));
                icon.appendChild(svgen("line", { x1: -5, y1: 10, x2: -10, y2: 15, "stroke-width": 1.5 }));
                icon.appendChild(svgen("line", { x1: -9, y1: 10, x2: -12, y2: 10, "stroke-width": 1.5 }));
                icon.appendChild(svgen("line", { x1: -14, y1: 10, x2: -17, y2: 10, "stroke-width": 1.5 }));
                icon.appendChild(svgen("line", { x1: -21, y1: 10, x2: -16, y2: 5, "stroke-width": 1.5 }));
                icon.appendChild(svgen("line", { x1: -21, y1: 10, x2: -16, y2: 15, "stroke-width": 1.5 }));
                break;
            case "distributionNetwork":
                icon.appendChild(svgen("line", { x1: -5, y1: 10, x2: -10, y2: 5, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -5, y1: 10, x2: -10, y2: 15, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -7, y1: 8, x2: -19, y2: 8, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -7, y1: 12, x2: -19, y2: 12, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -21, y1: 10, x2: -16, y2: 5, "stroke-width": 1.3 }));
                icon.appendChild(svgen("line", { x1: -21, y1: 10, x2: -16, y2: 15, "stroke-width": 1.3 }));
                break;
            case "material":
                icon.appendChild(svgen("path", { d: "M -7 13 L -12 5 L -20 5 L -25 13 L -20 21 L -12 21 Z"}));
                icon.appendChild(svgen("line", { x1: -10, y1: 13, x2: -13, y2: 8 }));
                icon.appendChild(svgen("line", { x1: -22, y1: 13, x2: -19, y2: 8 }));
                icon.appendChild(svgen("line", { x1: -19, y1: 18, x2: -13, y2: 18 }));
                break;
        }

        return(icon);
    }
}

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



// From https://stackoverflow.com/questions/19248686/
const getTextWidth = (text, font) => {
  const element = document.createElement('canvas');
  const context = element.getContext('2d');
  context.font = font;
  return context.measureText(text).width;
}

