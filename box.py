from nis import match
import sys
import re
import pytesseract
from pytesseract import Output
import cv2
import json

def mergeResults(newRes, totalRes):
    for i in newRes:
        for part in newRes[i].keys():
            if part in totalRes[i].keys():
                totalRes[i][part] += newRes[i][part]
            else:
                totalRes[i][part] = newRes[i][part]


def sortlist(lst):
    sortedList = sorted(lst, key = lambda x: (isinstance(x, str), x))
    finalList = {i:sortedList.count(i) for i in sortedList}
    return finalList

# Return a dictionary with the highest count of each element. Better to end up with too many parts than too few
def findHighest(lst):
    foundParts = {"res":{}, "cap":{}, "trans":{}, "posRes":{}, "posCap":{}}
    count = 0

    for i in lst:
        for j in i["results"].keys():
            for part in i["results"][j].keys():
                if part in foundParts[j].keys():
                    if i["results"][j][part] > foundParts[j][part]:
                        foundParts[j][part] = i["results"][j][part]
                else:
                    foundParts[j][part] = i["results"][j][part]
        count += 1
    return foundParts




def findText(imgFile):
    foundWords = {}
    config11 = r'--oem 1 --psm 11 --user-words werds.patterns'
    config6 = r'--oem 1 --psm 6 --user-words werds.patterns'
    config4 = r'--oem 1 --psm 4 --user-words werds.patterns'

    d11 = pytesseract.image_to_data(imgFile, config=config11, output_type=Output.DICT)
    d6 = pytesseract.image_to_data(imgFile, config=config6, output_type=Output.DICT)
    d4 = pytesseract.image_to_data(imgFile, config=config4, output_type=Output.DICT)

    dataArr = [{"data": d4, "results":{"res":[], "cap":[], "trans":[], "posRes":[], "posCap":[]}}, {"data": d6, "results":{"res":[], "cap":[], "trans":[], "posRes":[], "posCap":[]}}, {"data": d11, "results":{"res":[], "cap":[], "trans":[], "posRes":[], "posCap":[]}}]

    for j in dataArr:
        jdata = j["data"]
        n_boxes = len(jdata['level'])
        txt_len = len(jdata["text"])

        for i in range(n_boxes):
            resLen = len(j["results"]["res"])
            capLen = len(j["results"]["cap"])
            transLen = len(j["results"]["trans"])
            posResLen = len(j["results"]["posRes"])
            posCapLen = len(j["results"]["posCap"])
            newPosRes = []

            (x, y, w, h) = (jdata['left'][i], jdata['top'][i], jdata['width'][i], jdata['height'][i])
            # Todo need to handle possibility that its a longer string with multiple parts.
            matched = "none"


        # TODO might add a $ to say it has to end after nF ?
            #r"^\d*[.,]?\d*$"
            j["results"]["res"] += re.findall("\d+[.,]?\d*[rR]", jdata["text"][i])
            j["results"]["res"] += re.findall("\d+[.,]?\d*[kK]", jdata["text"][i])
            j["results"]["res"] += re.findall("\d+[.,]?\d*[mM]", jdata["text"][i])

            j["results"]["cap"] += re.findall("\d+[.,]?\d*u[fF]", jdata["text"][i])
            j["results"]["cap"] += re.findall("\d+[.,]?\d*n[fF]", jdata["text"][i])
            j["results"]["cap"] += re.findall("\d+[.,]?\d*p[fF]", jdata["text"][i])

            # TODO add a check to see if either res or cap succeeded. Only add to possible if this word is not
            # a part for sure.

            # Check if matched list has grown, if not check for possible resistors
            if len(j["results"]["res"]) == resLen:

                j["results"]["posRes"] += re.findall(r"(\b.{1,4}[rR]\b)", jdata["text"][i])
                j["results"]["posRes"] += re.findall(r"(\b.{1,4}[kK]\b)", jdata["text"][i])
                j["results"]["posRes"] += re.findall(r"(\b.{1,4}[mM]\b)", jdata["text"][i])

                if len(j["results"]["posRes"]) > posResLen:
                    #TODO don't do this work a second time just to have the text that matchs
                    newPosRes = re.findall(r"(\b.{1,4}[rR]\b)", jdata["text"][i])
                    newPosRes += re.findall(r"(\b.{1,4}[kK]\b)", jdata["text"][i])
                    newPosRes += re.findall(r"(\b.{1,4}[mM]\b)", jdata["text"][i])
                    matched = "posRes"
            else:
                matched = "res"

            # Check if matched list has grown, if not check for possible caps
            if len(j["results"]["cap"]) == capLen:

                j["results"]["posCap"] += re.findall(r"\b(.{1,4}u[fF]\b)", jdata["text"][i])
                j["results"]["posCap"] += re.findall(r"\b(.{1,4}n[fF]\b)", jdata["text"][i])
                j["results"]["posCap"] += re.findall(r"\b(.{1,4}p[fF]\b)", jdata["text"][i])
                if len(j["results"]["posCap"]) > posCapLen:
                    matched = "posCap"
            else:
                matched = "cap"

            # TODO CAP the size to match. What are the standard sizes?
            j["results"]["trans"] += re.findall("[0-9][nN][A-Za-z0-9_-]{3,}", jdata["text"][i])

            if len(j["results"]["trans"]) > transLen:
                matched = "trans"

            if matched == "res":    # Green
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            if matched == "cap":    # Teal
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 134, 0), 2)
            if matched == "trans":  # Orange
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 121, 255), 2)
            if matched == "posRes": # Red
                cv2.rectangle(img, (x, y), (x + w , y + h), (0, 0, 255), 2)
                cv2.putText(img, newPosRes[0], (x + 5, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
		            0.75, (0, 0, 255), 2)
            if matched == "posCap": # Purple
                cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 147), 2)
                cv2.putText(img, jdata["text"][i], (x + 5, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
		            0.75, (0, 0, 255), 2)

        j["results"]["res"] = sortlist(j["results"]["res"])
        j["results"]["cap"] = sortlist(j["results"]["cap"])
        j["results"]["trans"] = sortlist(j["results"]["trans"])
        j["results"]["posRes"] = sortlist(j["results"]["posRes"])
        j["results"]["posCap"] = sortlist(j["results"]["posCap"])

    #TODO make it a command line arg to show the images or not
    cv2.imshow('img', img)
    cv2.waitKey(0)

    return findHighest(dataArr)



print ('Argument List:', str(sys.argv), len(sys.argv))

if len(sys.argv) < 3:
    sys.exit("Argument format is: output.txt input.png input2.png ...")
    exit

file1 = open(sys.argv[1],"w")

imgFiles = sys.argv[2:]
print("Image files == ", imgFiles)

res = []
cap = []
trans = []
posRes = []
posCap = []
posTrans = []
totalParts = {"res":{}, "cap":{}, "trans":{}, "posRes":{}, "posCap":{}}

for i in imgFiles:
    print("Current i == ", i)
    img = cv2.imread(i)
    resultDict = findText(img)
    mergeResults(resultDict, totalParts)

if len(totalParts["res"]) != 0:
    file1.write("Resistors = ")
    file1.write(json.dumps(totalParts['res']))
    file1.write("\n\n")
if len(totalParts["cap"]) != 0:
    file1.write("Capacitors = ")
    file1.write(json.dumps(totalParts['cap']))
    file1.write("\n\n")
if len(totalParts["trans"]) != 0:
    file1.write("Transistors = ")
    file1.write(json.dumps(totalParts['trans']))
    file1.write("\n\n")

file1.write("\n\n")

if len(totalParts["posRes"]) != 0:
    file1.write("Possible Resistors = ")
    file1.write(json.dumps(totalParts['posRes']))
    file1.write("\n\n")

if len(totalParts["posCap"]) != 0:
    file1.write("Possible Capacitors = ")
    file1.write(json.dumps(totalParts['posCap']))
    file1.write("\n\n")

file1.close()
