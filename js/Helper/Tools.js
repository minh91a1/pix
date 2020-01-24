export default class Tools {
    AddRectangle(scene, x, y, width, height, fillColor, fillAlpha, centerOrigin = false) {
        let rect = scene.add.rectangle(x, y, width, height, fillColor, fillAlpha);
        if (!centerOrigin) {
            rect.displayOriginX = 0;
            rect.displayOriginY = 0;
            // rect.originX = 0;
            // rect.originY = 0;
        }
        return rect;
    }

    AddCircle(scene, x, y, radius, fillColor, fillAlpha) {
        let rect = scene.add.circle(x, y, radius, fillColor, fillAlpha);
        return rect;
    }

    IsContain(rectangle, x, y) {
        let _x = rectangle.x;
        let _y = rectangle.y;
        let _w = rectangle.width;
        let _h = rectangle.height;
        if (_x < x && x < _x + _w) {
            if (_y < y && y < _y + _h) {
                return true;
            }
        }

        return false;
    }

    isOverLineMax(text, maxLine) {
        return text.split('\n').length > maxLine;
    }

    WrapBitmapText(scene, bitmapTextResourceKey, text, seperator, maxWidth, maxLine) {
        var words = text.split(seperator); // usually space

        var pushWordCount = 0;
        var test = "";
        var output = "";
        var bitmapText = scene.add.bitmapText(0,0, bitmapTextResourceKey, text);
        var listParagraph = [];
        for (var w = 0, len = words.length; w < len; w++) {
            test += words[w] + " ";
            bitmapText.text = test;
            
            if (bitmapText.width > maxWidth) {
                let tempOutput = output;
                if (tempOutput == '') {
                    tempOutput += words[w] + " ";
                } else {
                    tempOutput += "\n" + words[w] + " ";
                }
                
                if (this.isOverLineMax(tempOutput, maxLine)) {
                    output = output.trim(' ');
                    listParagraph.push(output);
                    var pushwords = output.split(' ');
                    pushWordCount += pushwords.length;
                    output = words[w]+ " ";
                } else {
                    if (output == '') {
                        output += words[w] + " ";
                    } else {
                        output += "\n" + words[w] + " ";
                    }
                }
            }
            else {
                output += words[w] + " ";
            }
            test = output;
        }
        
        bitmapText.destroy();

        if (pushWordCount < words.length) {
            listParagraph.push(output);
        }
        
        return listParagraph;
    }
}