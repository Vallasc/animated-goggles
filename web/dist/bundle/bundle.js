"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Axes {
    constructor(canvas) {
        this.panningOffsetX = 0;
        this.panningOffsetY = 0;
        this.scale = 1;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.drawAxes();
    }
    drawAxes() {
        let w = this.canvas.width;
        let h = this.canvas.height;
        let distGrids = 10; //distance between grids
        let bigEvery = 5; // 1 big every 5 small
        let offX = 0;
        let offY = 0;
        let margin = 50;
        distGrids *= this.scale;
        if (this.panningOffsetX >= (w * 0.5) - margin)
            offX = (w * 0.5) - margin;
        else if (this.panningOffsetX <= margin - (w * 0.5))
            offX = margin - (w * 0.5);
        else
            offX = this.panningOffsetX;
        if (this.panningOffsetY >= (h * 0.5) - margin)
            offY = (h * 0.5) - margin;
        else if (this.panningOffsetY <= margin - (h * 0.5))
            offY = margin - (h * 0.5);
        else
            offY = this.panningOffsetY;
        this.context.clearRect(0, 0, w, h);
        this.context.strokeStyle = "rgb(60,0,0)";
        this.context.lineWidth = 1;
        // Draw >  
        this.context.beginPath();
        this.context.moveTo(w - 15, offY + h * 0.5 - 10);
        this.context.lineTo(w, offY + h * 0.5);
        this.context.lineTo(w - 15, offY + h * 0.5 + 10);
        this.context.stroke();
        // Draw ^ 
        this.context.beginPath();
        this.context.moveTo(offX + w * 0.5 - 10, 15);
        this.context.lineTo(offX + w * 0.5, 0);
        this.context.lineTo(offX + w * 0.5 + 10, 15);
        this.context.stroke();
        // Draw X-axis
        this.context.lineWidth = 1.5;
        this.context.beginPath();
        this.context.moveTo(0, offY + h * 0.5);
        this.context.lineTo(w, offY + h * 0.5);
        this.context.stroke();
        // Draw Y-axis
        this.context.beginPath();
        this.context.moveTo(offX + w * 0.5, 0);
        this.context.lineTo(offX + w * 0.5, h);
        this.context.stroke();
        this.context.lineWidth = 1;
        let bigTick = 6;
        let smallTick = 3;
        let newW = Math.floor(w / 2) - (Math.floor(w / 2) % (distGrids * bigEvery));
        let xNumTick = (newW / distGrids);
        // Ticks marks along the negative X-axis
        for (let i = 0; i < xNumTick; i++) {
            this.context.beginPath();
            let mod = (this.panningOffsetX + i * distGrids) % (newW);
            mod = mod < 0 ? (newW + mod) : mod; // Riporto il modulo positivo
            if (i % bigEvery == 0) {
                this.context.moveTo(w / 2 + mod, offY + h / 2 - bigTick);
                this.context.lineTo(w / 2 + mod, offY + h / 2 + bigTick);
            }
            else {
                this.context.moveTo(w / 2 + mod, offY + h / 2 - smallTick);
                this.context.lineTo(w / 2 + mod, offY + h / 2 + smallTick);
            }
            this.context.stroke();
        }
        // Ticks marks along the positive X-axis
        for (let i = xNumTick; i > 0; i--) {
            this.context.beginPath();
            let mod = (i * distGrids - this.panningOffsetX) % (newW);
            mod = mod < 0 ? (newW + mod) : mod; // Riporto il modulo positivo
            if ((i) % bigEvery == 0) {
                this.context.moveTo(w / 2 - mod, offY + h / 2 - bigTick);
                this.context.lineTo(w / 2 - mod, offY + h / 2 + bigTick);
            }
            else {
                this.context.moveTo(w / 2 - mod, offY + h / 2 - smallTick);
                this.context.lineTo(w / 2 - mod, offY + h / 2 + smallTick);
            }
            this.context.stroke();
        }
        let newH = Math.floor(h / 2) - (Math.floor(h / 2) % (distGrids * bigEvery));
        let yNumTick = (newH / distGrids);
        // Ticks marks along the negative Y-axis
        for (let i = 0; i < yNumTick; i++) {
            this.context.beginPath();
            let mod = (this.panningOffsetY + i * distGrids) % (newH);
            mod = mod < 0 ? (newH + mod) : mod; // Riporto il modulo positivo
            if (i % bigEvery == 0) {
                this.context.moveTo(offX + w / 2 - bigTick, h / 2 + mod);
                this.context.lineTo(offX + w / 2 + bigTick, h / 2 + mod);
            }
            else {
                this.context.moveTo(offX + w / 2 - smallTick, h / 2 + mod);
                this.context.lineTo(offX + w / 2 + smallTick, h / 2 + mod);
            }
            this.context.stroke();
        }
        // Ticks marks along the positive Y-axis
        for (let i = yNumTick; i > 0; i--) {
            this.context.beginPath();
            let mod = (i * distGrids - this.panningOffsetY) % (newH);
            mod = mod < 0 ? (newH + mod) : mod; // Riporto il modulo positivo
            if (i % bigEvery == 0) {
                this.context.moveTo(offX + w / 2 - bigTick, h / 2 - mod);
                this.context.lineTo(offX + w / 2 + bigTick, h / 2 - mod);
            }
            else {
                this.context.moveTo(offX + w / 2 - smallTick, h / 2 - mod);
                this.context.lineTo(offX + w / 2 + smallTick, h / 2 - mod);
            }
            this.context.stroke();
        }
        this.context.fillStyle = "rgb(60,0,0)";
        this.context.font = "15px Arial";
        this.context.fillText('Y', w / 2 + 20 + offX, 30);
        this.context.fillText('X', w - 30, h / 2 + 30 + offY);
        this.context.fillText(': 1 astronomical unit', w - 170, h - 70);
        let scaleString = 'scale: ';
        let roundScale = Math.round(this.scale * 10) / 10;
        let str = scaleString.concat(roundScale.toString());
        this.context.fillText(str, w - 150, h - 40);
        this.context.strokeStyle = "rgb(60,0,0)";
        this.context.lineWidth = 1;
        //long line
        this.context.moveTo(w - 180 - distGrids, h - 60);
        this.context.lineTo(w - 30, h - 60);
        // first |
        this.context.moveTo(w - 175 - distGrids, h - 78);
        this.context.lineTo(w - 175 - distGrids, h - 70);
        // second |
        this.context.moveTo(w - 175, h - 78);
        this.context.lineTo(w - 175, h - 70);
        // central -
        this.context.moveTo(w - 175 - distGrids, h - 74);
        this.context.lineTo(w - 175, h - 74);
        this.context.stroke();
    }
    setPanningOffset(x, y) {
        this.panningOffsetX = x;
        this.panningOffsetY = y;
        this.drawAxes();
    }
    setScale(s) {
        this.scale = s;
    }
}
class Body {
    constructor({ id = -1, x = 0, y = 0, radius = 0, } = {}) {
        this.id = 0;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.visible = false;
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    drawOnCanvas(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();
    }
    print() {
        console.log(`x: ${this.x}, y: ${this.y}`);
    }
    setVisible(value) {
        this.visible = value;
        if (!value)
            this.reset();
    }
    reset() {
        this.id = -1;
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.visible = false;
    }
    clone(src) {
        this.id = src.id;
        this.x = src.x;
        this.y = src.y;
        this.radius = src.radius;
        this.visible = src.visible;
    }
}
class ChartStartup {
    static main() {
        return 0;
    }
    static reset() {
        document.getElementById("file").innerHTML = window.file.name;
        ChartStartup.loadFile(window.file);
    }
    static loadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            let fm = new FileManager(file);
            yield fm.init();
            let energies = yield fm.getEnergies();
            let arrays = energies.getArrays();
            var trace1 = {
                x: arrays.x,
                y: arrays.yTotalEnergy,
                type: 'scatter'
            };
            var trace2 = {
                x: arrays.x,
                y: arrays.yKineticEnergy,
                type: 'scatter'
            };
            var trace3 = {
                x: arrays.x,
                y: arrays.yInternalEnergy,
                type: 'scatter'
            };
            var trace4 = {
                x: arrays.x,
                y: arrays.yPotentialEnergy,
                type: 'scatter'
            };
            var trace5 = {
                x: arrays.x,
                y: arrays.yBindingEnergy,
                type: 'scatter'
            };
            var data = [trace1, trace2, trace3, trace4, trace5];
            var layout = {
                xaxis: {
                    rangeslider: {},
                }
            };
            var options = {};
            Plotly.newPlot('plot', data, layout, options);
        });
    }
}
zip.workerScriptsPath = "./dist/lib/zipjs/";
class EnergyArray {
    constructor(blob) {
        // Nel file delle energie l'indice dell'array corrisponde all'iterazione
        // size = numero di iterazioni
        // ["Total energy","Kinetic energy", "Internal energy", "Potential energy", "Binding energy"]
        this.numParamsRow = 5;
        this.buffer = new Float32Array(blob);
        this.size = this.buffer.length / this.numParamsRow;
        console.log(this.size);
    }
    getEnergy(index, type) {
        return this.buffer[type + this.numParamsRow * index];
    }
    getArrays() {
        let x = [];
        let yTotalEnergy = [];
        let yKineticEnergy = [];
        let yInternalEnergy = [];
        let yPotentialEnergy = [];
        let yBindingEnergy = [];
        for (let i = 0; i < this.size; i++) {
            x.push(i);
            yTotalEnergy.push(this.buffer[0 + this.numParamsRow * i]);
            yKineticEnergy.push(this.buffer[1 + this.numParamsRow * i]);
            yInternalEnergy.push(this.buffer[2 + this.numParamsRow * i]);
            yPotentialEnergy.push(this.buffer[3 + this.numParamsRow * i]);
            yBindingEnergy.push(this.buffer[4 + this.numParamsRow * i]);
        }
        return {
            x: x,
            yTotalEnergy: yTotalEnergy,
            yKineticEnergy: yKineticEnergy,
            yInternalEnergy: yInternalEnergy,
            yPotentialEnergy: yPotentialEnergy,
            yBindingEnergy: yBindingEnergy
        };
    }
}
class ZipReader {
    static getEntries(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                zip.createReader(new zip.BlobReader(file), (zipReader) => {
                    ZipReader.zipReader = zipReader;
                    zipReader.getEntries((entries) => resolve(entries));
                }, () => { console.log("Error loading zip"); reject("error"); });
            });
        });
    }
    static getEntryFile(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                entry.getData(new zip.BlobWriter(), (blob) => __awaiter(this, void 0, void 0, function* () {
                    resolve(blob);
                }), (p) => {
                });
            });
        });
    }
    static closeZipReader() {
        if (ZipReader.zipReader != null) {
            ZipReader.zipReader.close();
            ZipReader.zipReader = null;
        }
    }
}
class FileManager {
    constructor(file) {
        this.infoJson = null;
        this.file = file;
        this.entriesMap = new Map();
        this.numIterations = 0;
        this.fileIndex = 0;
        this.bodies = new Array();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let entries = yield ZipReader.getEntries(this.file);
            //console.log(entries);
            for (let i = 0; i < entries.length; i++) {
                this.entriesMap.set(entries[i].filename, entries[i]);
            }
            let infoFile = yield ZipReader.getEntryFile(this.entriesMap.get("info.json"));
            this.infoJson = JSON.parse(yield infoFile.text());
            console.log(this.infoJson);
            this.numIterations = this.infoJson["numIteration"];
        });
    }
    close() {
        ZipReader.closeZipReader();
    }
    getInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.infoJson;
        });
    }
    getEnergies() {
        return __awaiter(this, void 0, void 0, function* () {
            let energiesFileName = this.infoJson["energiesFileName"];
            let blob = yield ZipReader.getEntryFile(this.entriesMap.get(energiesFileName));
            let array = yield blob.arrayBuffer();
            return new EnergyArray(array);
        });
    }
    loadNextFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield ZipReader.getEntryFile(this.entriesMap.get(this.infoJson["simFileName"] + this.fileIndex + ".bin"));
            let arrayBuffer = yield file.arrayBuffer();
            let floatArray = new Float32Array(arrayBuffer);
            let objects;
            let offset = 0;
            try {
                for (let i = (FileManager.numIterationParam - 1); i < floatArray.length; i = i + offset) {
                    offset = FileManager.bodyNumParams * floatArray[i] + FileManager.numIterationParam;
                    objects = new Float32Array(floatArray.slice(i - (FileManager.numIterationParam - 1), i + offset));
                    this.bodies.push(objects);
                }
            }
            catch (e) {
                throw Error("Failed parsing file");
            }
            this.fileIndex++;
        });
    }
    getBodies(index) {
        return __awaiter(this, void 0, void 0, function* () {
            // EOF
            if (index >= this.numIterations)
                return null;
            while (this.bodies.length <= index) {
                yield this.loadNextFile();
            }
            return this.bodies[index];
        });
    }
    getNumIterations() {
        return this.numIterations;
    }
}
FileManager.bodyNumParams = 5;
FileManager.numIterationParam = 2; // id + size
class Fifo {
    constructor() {
        this.size = 0;
        this.first = null;
        this.last = null;
    }
    push(element) {
        if (this.size == 0) {
            let e = new FifoElement(element, null);
            this.first = e;
            this.last = e;
        }
        else {
            let e = new FifoElement(element, null);
            this.last.next = e;
            this.last = e;
        }
        this.size++;
    }
    pushFifo(fifo) {
        if (this.size == 0) {
            this.first = fifo.first;
            this.last = fifo.last;
        }
        else {
            this.last.next = fifo.first;
            this.last = fifo.last;
        }
        this.size += fifo.size;
    }
    pop() {
        if (this.size == 0) {
            return null;
        }
        else if (this.size == 1) {
            let e = this.first.element;
            this.first = null;
            this.last = null;
            this.size--;
            return e;
        }
        else {
            let e = this.first.element;
            this.first = this.first.next;
            this.size--;
            return e;
        }
    }
    clear() {
        this.size = 0;
        this.first = null;
        this.last = null;
    }
}
class FifoElement {
    constructor(element, next) {
        this.next = null;
        this.element = null;
        this.element = element;
        this.next = next;
    }
}
class FileStreamer {
    constructor(file) {
        this.file = file;
        this.offset = 0;
        this.defaultChunkSize = 64 * 1024; // bytes
        this.rewind();
    }
    rewind() {
        this.offset = 0;
    }
    isEndOfFile() {
        return this.offset >= this.getFileSize();
    }
    readBlockAsText(length = this.defaultChunkSize) {
        const fileReader = new FileReader();
        const blob = this.file.slice(this.offset, this.offset + length);
        this.file.stream;
        return new Promise((resolve, reject) => {
            fileReader.onloadend = (event) => {
                const target = (event.target);
                if (target.error == null) {
                    const result = target.result;
                    this.offset += result.length;
                    this.testEndOfFile();
                    resolve(result);
                }
                else {
                    reject(target.error);
                }
            };
            fileReader.readAsText(blob);
        });
    }
    testEndOfFile() {
        if (this.isEndOfFile()) {
            console.log('Done reading file');
        }
    }
    getFileSize() {
        return this.file.size;
    }
}
class JsonStreamer {
    constructor(fs) {
        this.initialSequenceSize = 12;
        this.initialSequenceElementSize = 16;
        this.afterElementSize = 1;
        this.fs = fs;
        this.buffer = "";
        this.chunkSize = 200;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.fs.isEndOfFile())
                return null;
            let s = yield this.fs.readBlockAsText(this.initialSequenceSize);
            console.log(s);
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fs.isEndOfFile()) {
                let s1 = yield this.fs.readBlockAsText(this.initialSequenceElementSize);
                console.log(s1);
                if (s1 == ']}')
                    return null;
                let n = parseInt(s1.slice(8, 16)) || null;
                if (n == null)
                    return null;
                console.log(n);
                let s2 = yield this.fs.readBlockAsText(n - this.initialSequenceElementSize + this.afterElementSize);
                console.log(s1 + s2);
                return JSON.parse(s1 + s2.slice(0, -1));
            }
            return null;
        });
    }
}
class Startup {
    static main() {
        console.log('Main');
        Startup.slider = document.getElementById('slider');
        Startup.mainCanvas = document.getElementById('main-canvas');
        window.onresize = Startup.onWindowResized;
        Startup.trajectoryCanvas = document.getElementById('trajectory-canvas');
        Startup.trajectory = new Trajectory(Startup.trajectoryCanvas);
        Startup.axesCanvas = document.getElementById('axes-canvas');
        Startup.axes = new Axes(Startup.axesCanvas);
        Startup.loop = new Loop(Startup.mainCanvas, Startup.gui);
        let mouseInput = new MouseInput(Startup.loop, Startup.axes, Startup.trajectory);
        Startup.createGui(); // And resize
        return 0;
    }
    static createGui() {
        let guiContainer = document.getElementById("main-container");
        Startup.gui = new guify({
            title: 'Solar system',
            theme: 'dark',
            align: 'right',
            width: Startup.canvasMarginRight,
            barMode: 'offset',
            panelMode: 'inner',
            opacity: 0.9,
            root: guiContainer,
            open: true,
            onOpen: (value) => {
                if (value) {
                    Startup.canvasMarginRight = 350;
                }
                else {
                    Startup.canvasMarginRight = 0;
                }
                Startup.resize();
            }
        });
        Startup.gui.Register({
            type: 'file',
            label: 'File',
            onChange: (file) => __awaiter(this, void 0, void 0, function* () {
                Startup.file = file;
                yield Startup.loop.reset(file);
                if (Startup.chartWindow != null) {
                    Startup.chartWindow.file = Startup.file;
                    Startup.chartWindow.reset();
                }
            })
        });
        Startup.gui.Register([{
                type: 'button',
                label: 'Play/Pause',
                streched: true,
                action: () => {
                    Startup.loop.playPause();
                }
            }, {
                type: 'button',
                label: 'Rewind',
                streched: true,
                action: () => {
                    Startup.loop.reset();
                }
            }, {
                type: 'display',
                label: 'Energy chart',
                element: Startup.loop.chart.container,
            }, {
                type: 'button',
                label: 'Show charts',
                streched: true,
                action: () => {
                    console.log(Startup.file);
                    if (Startup.chartWindow != null) {
                        Startup.chartWindow.close();
                    }
                    Startup.chartWindow = window.open("charts.html", "MsgWindow", "width=900,height=900");
                    Startup.chartWindow.addEventListener('load', () => {
                        Startup.chartWindow.file = Startup.file;
                        Startup.chartWindow.reset();
                    }, false);
                }
            }, {
                type: 'folder',
                label: 'Selected',
                open: true
            }, {
                type: 'folder',
                label: 'Controls',
                open: true
            }, {
                type: 'folder',
                label: 'FPS',
                open: false
            }, {
                type: 'button',
                label: 'Run Main',
                streched: true,
                action: () => {
                    //_web_main();
                    //Startup.loop.resetArray(new Float32Array(Module.FS.readFile("sim0.bin").buffer))
                }
            }]);
        Startup.gui.Register(Startup.loop.guiPanel);
        Startup.gui.Loader(false);
        Startup.loop.barContainer = document.getElementById("guify-bar-container");
    }
    static onWindowResized(event) {
        Startup.resize();
    }
    static resize() {
        Startup.mainCanvas.width = window.innerWidth - Startup.canvasMarginRight;
        Startup.mainCanvas.height = window.innerHeight - Startup.canvasMarginTop;
        Startup.mainCanvas.style.marginRight = Startup.canvasMarginRight + "px";
        Startup.mainCanvas.style.marginTop = Startup.canvasMarginTop + "px";
        //Startup.gui.panel.style += "overflow-y: scroll; height: 300px;"
        Startup.axesCanvas.width = window.innerWidth - Startup.canvasMarginRight;
        Startup.axesCanvas.height = window.innerHeight - Startup.canvasMarginTop;
        Startup.axesCanvas.style.marginRight = Startup.canvasMarginRight + "px";
        Startup.axesCanvas.style.marginTop = Startup.canvasMarginTop + "px";
        Startup.axes.drawAxes();
        Startup.trajectoryCanvas.width = window.innerWidth - Startup.canvasMarginRight;
        Startup.trajectoryCanvas.height = window.innerHeight - Startup.canvasMarginTop;
        Startup.trajectoryCanvas.style.marginRight = Startup.canvasMarginRight + "px";
        Startup.trajectoryCanvas.style.marginTop = Startup.canvasMarginTop + "px";
        Startup.slider.style.width = window.innerWidth - Startup.canvasMarginRight - 4 + "px";
    }
}
Startup.canvasMarginTop = 25;
Startup.canvasMarginRight = 350;
Startup.someNumber = 0;
Startup.chartWindow = null;
class MouseInput {
    constructor(loop, axes, trajectory) {
        this.globalScale = 1;
        this.globalOffsetX = 0;
        this.globalOffsetY = 0;
        this.panningStartX = 0;
        this.panningStartY = 0;
        this.panningOffsetX = 0;
        this.panningOffsetY = 0;
        this.panning = false;
        this.mouseMoveListener = null;
        this.mouseUpListener = null;
        this.loop = loop;
        this.axes = axes;
        this.trajectory = trajectory;
        this.canvas = loop.canvas;
        this.canvas.addEventListener("mousedown", (e) => this.startPan(e, this));
        this.mouseMoveListener = (e) => this.pan(e, this);
        this.mouseUpListener = (e) => this.endPan(e, this);
        this.loop.setPanningOffset(0, 0);
    }
    startPan(e, self) {
        if (self.panning)
            return;
        self.panning = true;
        //console.log("start pan");
        self.canvas.addEventListener("mousemove", self.mouseMoveListener);
        self.canvas.addEventListener("mouseup", self.mouseUpListener);
        self.canvas.addEventListener("mouseleave", self.mouseUpListener);
        self.panningStartX = e.clientX;
        self.panningStartY = e.clientY;
    }
    pan(e, self) {
        self.panningOffsetX = e.clientX - self.panningStartX;
        self.panningOffsetY = e.clientY - self.panningStartY;
        self.loop.setPanningOffset(self.globalOffsetX + self.panningOffsetX, self.globalOffsetY + self.panningOffsetY);
        self.axes.setPanningOffset(self.globalOffsetX + self.panningOffsetX, self.globalOffsetY + self.panningOffsetY);
        self.trajectory.setPanningOffset(self.globalOffsetX + self.panningOffsetX, self.globalOffsetY + self.panningOffsetY);
    }
    endPan(e, self) {
        self.panning = false;
        self.globalOffsetX += self.panningOffsetX;
        self.globalOffsetY += self.panningOffsetY;
        self.canvas.removeEventListener("mousemove", self.mouseMoveListener);
        self.canvas.removeEventListener("mouseup", self.mouseUpListener);
        self.canvas.removeEventListener("mouseleave", self.mouseUpListener);
        if (self.panningStartX == e.clientX && self.panningStartY == e.clientY)
            self.click(self, e.clientX, e.clientY);
    }
    click(self, x, y) {
        self.loop.setSelected(x, y - 25); // TODO aggiustare 25
    }
    setOffset(x, y) {
        this.globalOffsetX = x;
        this;
        this.globalOffsetY = y;
        this.loop.setPanningOffset(this.globalOffsetX, this.globalOffsetY);
        this.axes.setPanningOffset(this.globalOffsetX, this.globalOffsetY);
        this.trajectory.setPanningOffset(this.globalOffsetX, this.globalOffsetY);
    }
}
class Loop {
    constructor(canvas, gui) {
        this.panningOffsetX = 0;
        this.panningOffsetY = 0;
        this.selectX = null;
        this.selectY = null;
        this.selectedBody = new Body();
        this.axesBodyOffset = new Body();
        this.scale = 1;
        this.forceLoadAllCheckbox = false;
        this.isPlaying = false;
        this.isEof = false;
        this.reqId = -1;
        this.numIteration = 0;
        this.lastTime = 0;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.imatrix = this.context.getTransform().inverse();
        this.file = new File([], "");
        this.energyFile = new EnergyArray(new ArrayBuffer(0));
        this.fileManager = null;
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        this.stats.dom.style = "margin-left: 100px;";
        this.chart = new NumberChart(["Total energy", "Kinetic energy", "Internal energy", "Potential energy", "Binding energy"], ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"]);
        let div = document.createElement("div");
        div.id = "container";
        this.guiPanel = [
            {
                type: 'display',
                label: '',
                folder: "FPS",
                element: this.stats.dom,
            }, {
                type: 'button',
                label: 'Zoom -',
                folder: 'Controls',
                streched: false,
                action: () => {
                    this.scale -= 0.2;
                    Startup.trajectory.setScale(this.scale);
                    Startup.axes.setScale(this.scale);
                    //Startup.trajectory.drawTrajectory()
                    Startup.axes.drawAxes();
                }
            }, {
                type: 'button',
                label: 'Zoom +',
                folder: 'Controls',
                streched: false,
                action: () => {
                    this.scale += 0.2;
                    Startup.trajectory.setScale(this.scale);
                    Startup.axes.setScale(this.scale);
                    //Startup.trajectory.drawTrajectory()
                    Startup.axes.drawAxes();
                }
            }, {
                folder: 'Selected',
                type: 'button',
                label: 'Change center axes',
                streched: true,
                action: () => {
                    if (this.selectedBody.visible) {
                        this.axesBodyOffset.clone(this.selectedBody);
                        //this.setAxesOffset(this.axesBodyOffset);
                        //Startup.trajectory.drawTrajectory()
                        this.selectedBody.setVisible(false);
                    }
                }
            }, {
                folder: 'Selected',
                type: 'button',
                label: 'Reset center axes',
                streched: true,
                action: () => {
                    this.axesBodyOffset.reset();
                    //this.setAxesOffset(this.axesBodyOffset);
                    //Startup.trajectory.drawTrajectory()
                    this.selectedBody.setVisible(false);
                }
            }, {
                type: 'display',
                folder: 'Controls',
                label: 'Scale',
                object: this,
                property: 'scale',
            }, {
                type: 'checkbox',
                folder: 'Controls',
                label: 'Force loading all file in memory',
                object: this,
                property: 'forceLoadAllCheckbox',
            }, {
                type: 'display',
                folder: 'Controls',
                label: 'Is playing',
                object: this,
                property: 'isPlaying',
            }, {
                type: 'display',
                folder: 'Controls',
                label: 'Is EOF',
                object: this,
                property: 'isEof',
            }, {
                type: 'display',
                folder: 'Controls',
                label: 'Iteration',
                object: this,
                property: 'numIteration',
            }, {
                type: 'display',
                folder: 'Controls',
                label: 'Offset X',
                object: this,
                property: 'panningOffsetX',
            }, {
                type: 'display',
                folder: 'Controls',
                label: 'Offset Y',
                object: this,
                property: 'panningOffsetY',
            }, {
                type: 'display',
                folder: 'Selected',
                label: 'X',
                object: this.selectedBody,
                property: 'x',
            }, {
                type: 'display',
                folder: 'Selected',
                label: 'Y',
                object: this.selectedBody,
                property: 'y',
            }, {
                type: 'display',
                folder: 'Selected',
                label: 'Radius',
                object: this.selectedBody,
                property: 'radius',
            }
        ];
        this.barContainer = document.getElementById("guify-bar-container");
        let saveIsPlaying = false;
        Startup.slider.onmousedown = (ev) => {
            saveIsPlaying = this.isPlaying;
            this.isPlaying = false;
        };
        Startup.slider.onmouseup = (ev) => {
            this.selectedBody.reset();
            this.selectX = null;
            this.selectY = null;
            this.numIteration = parseInt(Startup.slider.value);
            this.isPlaying = saveIsPlaying;
        };
    }
    draw(time) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stats.begin();
            let objects = yield this.fileManager.getBodies(this.numIteration);
            if (objects == null) {
                this.pause();
                this.isEof = true;
            }
            else {
                this.drawStates(objects);
                this.isEof = false;
            }
            if (this.isPlaying) {
                Startup.slider.value = this.numIteration + "";
                this.numIteration++;
            }
            this.reqId = window.requestAnimationFrame((time) => this.draw(time));
            this.stats.end();
            this.lastTime = time;
        });
    }
    // per aumentare la velocita di calcolo utilizzo un quadrato circoscritto
    squareHitTest(x, y, r, xp, yp) {
        let x1 = x - r;
        let y1 = y - r;
        let x2 = x + r;
        let y2 = y + r;
        return (x1 <= xp && xp <= x2 && y1 <= yp && yp <= y2);
    }
    static roundTo1(x) {
        if (x > 0 && x < 1)
            return 1;
        else
            return x;
    }
    getColorFromInt(x) {
        let numColors = 10;
        let r = 255 * x / numColors;
        let b = 255 - r;
        return "rgb(" + r + ",0," + b + ")";
    }
    VtoW(screenX, screenY) {
        let x = screenX * this.imatrix.a + screenY * this.imatrix.c + this.imatrix.e;
        let y = screenX * this.imatrix.b + screenY * this.imatrix.d + this.imatrix.f;
        return { x: x, y: y };
    }
    drawStates(objects) {
        const numParams = FileManager.bodyNumParams;
        // Controllo se devo camabiare il centro degli assi
        if (this.axesBodyOffset.id != -1) {
            for (let i = 0; i < objects[FileManager.numIterationParam - 1]; i++) {
                // Prelevo gli attributi del body
                let id = objects[FileManager.numIterationParam + i * numParams + 0];
                let x = objects[FileManager.numIterationParam + i * numParams + 1]; // posizione 1 dell'array
                let y = objects[FileManager.numIterationParam + i * numParams + 2];
                // Mette l'offset dell'iterazione precednte
                if (this.axesBodyOffset.id == id) {
                    this.axesBodyOffset.x = x;
                    this.axesBodyOffset.y = y;
                    break;
                }
            }
        }
        let xBase = this.canvas.width / 2 + this.panningOffsetX - this.axesBodyOffset.x * this.scale;
        let yBase = this.canvas.height / 2 + this.panningOffsetY + this.axesBodyOffset.y * this.scale;
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(xBase, yBase);
        this.context.scale(this.scale, -this.scale);
        this.imatrix = this.context.getTransform().inverse();
        this.context.beginPath();
        // Controllo che ci sia un'occorrenza del body selezionato
        let bodyIsIn = false;
        let fillColor = -1;
        for (let i = 0; i < objects[FileManager.numIterationParam - 1]; i++) {
            // Prelevo gli attributi del body
            let id = objects[FileManager.numIterationParam + i * numParams + 0];
            let x = objects[FileManager.numIterationParam + i * numParams + 1]; // posizione 1 dell'array
            let y = objects[FileManager.numIterationParam + i * numParams + 2];
            let r = objects[FileManager.numIterationParam + i * numParams + 3];
            let t = objects[FileManager.numIterationParam + i * numParams + 4];
            // Se il corpo e' stato selezionato
            if (this.selectedBody.id == id && this.selectedBody.visible) {
                this.selectedBody.x = x;
                this.selectedBody.y = y;
                this.selectedBody.radius = r;
                bodyIsIn = true;
            }
            // E' stato premuto sullo schermo
            if (this.selectX != null && this.selectY != null) {
                let cords = this.VtoW(this.selectX, this.selectY);
                if (this.squareHitTest(x, y, Loop.roundTo1(r), cords.x, cords.y)) {
                    this.selectedBody.id = id;
                    this.selectedBody.x = x;
                    this.selectedBody.y = y;
                    this.selectedBody.radius = r;
                    this.selectedBody.setVisible(true);
                    this.selectX = null;
                    this.selectY = null;
                    Startup.trajectory.clear();
                    bodyIsIn = true;
                }
                else {
                    bodyIsIn = false;
                }
            }
            // Draw            
            if (fillColor != t) { // Cambio colore pennello
                this.context.closePath();
                this.context.fill();
                this.context.beginPath();
                fillColor = t;
                this.context.fillStyle = this.getColorFromInt(fillColor);
            }
            this.context.moveTo(x, y);
            this.context.arc(x, y, Math.floor(Loop.roundTo1(r)), 0, 2 * Math.PI);
            // End draw
        }
        this.context.closePath();
        this.context.fill();
        if (this.selectedBody.visible && bodyIsIn) { // Body selezionato
            this.context.beginPath();
            this.context.strokeStyle = "rgba(0,255,0,0.7)";
            this.context.lineWidth = 1.5;
            this.context.arc(this.selectedBody.x, this.selectedBody.y, this.selectedBody.radius + 4, 0, 2 * Math.PI);
            this.context.closePath();
            this.context.stroke();
            if (this.numIteration % 5 == 0)
                Startup.trajectory.addCords(this.selectedBody.x - this.axesBodyOffset.x, this.selectedBody.y - this.axesBodyOffset.y);
        }
        else {
            this.selectedBody.setVisible(false);
            Startup.trajectory.clear();
        }
        // Aggiorno grafico ongni 30 frame
        if (this.numIteration % 30 == 0) {
            this.chart.updateChart([
                { x: this.numIteration, y: this.energyFile.getEnergy(this.numIteration, 0) },
                { x: this.numIteration, y: this.energyFile.getEnergy(this.numIteration, 1) },
                { x: this.numIteration, y: this.energyFile.getEnergy(this.numIteration, 2) },
                { x: this.numIteration, y: this.energyFile.getEnergy(this.numIteration, 3) },
                { x: this.numIteration, y: this.energyFile.getEnergy(this.numIteration, 4) }
            ]);
        }
    }
    play() {
        if (this.isEof)
            return;
        this.isPlaying = true;
        this.barContainer.innerText = "⏵";
    }
    pause() {
        if (this.isEof)
            return;
        this.isPlaying = false;
        this.barContainer.innerText = "⏸";
    }
    stop() {
        this.isEof = false;
        this.isPlaying = false;
        this.numIteration = 0;
        this.selectedBody.reset();
        this.axesBodyOffset.reset();
        this.selectX = null;
        this.selectY = null;
        this.chart.deleteData();
        this.barContainer.innerText = "⏹";
    }
    playPause() {
        if (!this.isPlaying)
            this.play();
        else
            this.pause();
    }
    reset(file = this.file) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("reset");
            this.barContainer.style.color = "#ffffff";
            this.barContainer.innerText = "";
            window.cancelAnimationFrame(this.reqId);
            this.stop();
            try {
                this.file = file;
                yield this.loadFile(file);
            }
            catch (e) {
                console.error(e);
            }
            this.pause();
            this.draw(0);
            Startup.slider.value = "0";
            Startup.slider.max = this.fileManager.getNumIterations() + "";
        });
    }
    loadFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            Startup.gui.Loader(true);
            this.fileManager = new FileManager(file);
            yield this.fileManager.init();
            this.energyFile = yield this.fileManager.getEnergies();
            yield this.fileManager.getBodies(0);
            /*if(this.forceLoadAllCheckbox){
    
            }*/
            Startup.gui.Loader(false);
            return;
        });
    }
    setPanningOffset(x, y) {
        this.panningOffsetX = x;
        this.panningOffsetY = y;
    }
    setSelected(x, y) {
        this.selectX = x;
        this.selectY = y;
    }
}
class NumberChart {
    constructor(titles, colors) {
        this.width = 305;
        this.height = 300;
        this.size = titles.length;
        this.container = document.createElement("div");
        this.container.setAttribute("style", "width: 100%; overflow: auto; display: flex; flex-direction: column-reverse;");
        this.div = document.createElement("div");
        this.div.setAttribute("style", "width: " + this.width + "px; height: " + this.height + "px; position: relative;");
        this.container.appendChild(this.div);
        this.canvas = document.createElement("canvas");
        this.canvas.height = this.height;
        //this.canvas.width = this.width;
        this.context = this.canvas.getContext("2d");
        this.div.appendChild(this.canvas);
        let datasets = [];
        for (let i = 0; i < titles.length; i++) {
            datasets.push({
                label: titles[i],
                borderWidth: 1,
                // backgroundColor: "rgba(255, 0, 0, 0.6)",
                borderColor: colors[i],
                filled: false,
                data: []
            });
        }
        this.chart = new Chart(this.context, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                tooltips: {
                    mode: "index"
                },
                elements: {
                    line: {
                        tension: 0 // disables bezier curves
                    },
                    point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 3
                    }
                },
                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    display: true,
                    align: "start",
                    labels: {
                        fontColor: "#ebebeb",
                        fontSize: 10,
                    }
                },
                scales: {
                    yAxes: [{
                            ticks: {
                                fontColor: "#ebebeb",
                                callback: function (val) {
                                    return val.toExponential();
                                }
                            },
                            gridLines: {
                                zeroLineColor: '#ffffff'
                            }
                        }],
                    xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                fontColor: "#ebebeb",
                                autoSkip: true,
                                maxRotation: 0,
                                minRotation: 0,
                            },
                            gridLines: {
                                zeroLineColor: '#ffffff'
                            }
                        }]
                },
                animation: {
                    duration: 0 // general animation time
                },
                hover: {
                    animationDuration: 0 // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0,
                pan: {
                    enabled: true,
                    mode: "x",
                    speed: 10,
                    threshold: 5
                },
                zoom: {
                    enabled: true,
                    //drag: true,
                    mode: "x",
                    speed: 0.1,
                    threshold: 2,
                    sensitivity: 3
                }
            }
        });
    }
    updateChart(data) {
        /*
        // allow 1px inaccuracy by adding 1
        const isScrolledToLeft = this.container.scrollWidth- this.container.clientWidth <= this.container.scrollLeft + 1
        if(this.chart.data.datasets[0].data.length % 4 == 0){
            this.width += 80;
            this.div.style.width = this.width+'px';
        }
        // Scroll to left
        if (isScrolledToLeft) {
            this.container.scrollLeft = this.container.scrollWidth - this.container.clientWidth
        }*/
        for (let i = 0; i < this.size; i++) {
            this.chart.data.datasets[i].data.push({ x: new Date(data[i].x), y: data[i].y });
        }
        this.chart.update();
    }
    deleteData() {
        this.width = 250;
        this.div.style.width = this.width + 'px';
        for (let i = 0; i < this.size; i++) {
            this.chart.data.datasets[i].data = [];
        }
        this.chart.update();
    }
}
class Trajectory {
    constructor(canvas) {
        this.panningOffsetX = 0;
        this.panningOffsetY = 0;
        this.axesOffsetX = 0;
        this.axesOffsetY = 0;
        this.points = [];
        this.maxSize = 1000;
        this.scale = 1;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
    }
    addCords(x, y) {
        this.points.push([x, y]);
        if (this.points.length > this.maxSize)
            this.points.shift();
        this.drawTrajectory();
    }
    drawTrajectory() {
        let xBase = this.canvas.width / 2 + this.panningOffsetX - this.axesOffsetX;
        let yBase = this.canvas.height / 2 + this.panningOffsetY + this.axesOffsetY;
        this.context.strokeStyle = "rgba(0,0,0,0.6)";
        this.context.lineWidth = 0.6;
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(xBase, yBase);
        this.context.scale(this.scale, -this.scale);
        this.context.beginPath();
        for (let i = 1; i < this.points.length; i++) {
            if (this.points.length != 1) {
                this.context.moveTo(this.points[i - 1][0], this.points[i - 1][1]);
                this.context.lineTo(this.points[i][0], this.points[i][1]);
            }
        }
        this.context.stroke();
    }
    clear() {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.points = [];
    }
    setPanningOffset(x, y) {
        this.panningOffsetX = x;
        this.panningOffsetY = y;
        this.drawTrajectory();
    }
    setAxesOffset(x, y) {
        this.axesOffsetX = x;
        this.axesOffsetY = y;
    }
    setScale(s) {
        this.scale = s;
    }
}
//# sourceMappingURL=bundle.js.map