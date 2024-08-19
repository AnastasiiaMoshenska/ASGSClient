import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { Element } from '../../models/models';
import { Filter } from '../../filter/root-filter/root-filter.component';
import { SVG_FRAME, VIEW_BOX } from '../../constants/constants';

@Component({
    selector: '[lt-svg]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './svg.component.html',
    styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnChanges, AfterViewInit {
    readonly SVG_FRAME = SVG_FRAME;
    readonly VIEW_BOX = VIEW_BOX;

    readonly ZOOM_COUNTER_DELTA_Y = -1000;
    readonly ZOOM_COUNTER = 0.05;

    @Input() filter!: Filter;

    numbersArray: number[] = [];
    zoomCounter = 1;

    constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.zoomIn();
    }

    @HostListener('wheel', ['$event'])
    onMouseWheel(event: WheelEvent) {
        this.zoomCounter += event.deltaY / this.ZOOM_COUNTER_DELTA_Y;
        if (this.zoomCounter < this.ZOOM_COUNTER) {
            this.zoomCounter = this.ZOOM_COUNTER;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.filter.elements !== undefined && this.filter.elements.length > 0) {
            this.generateSvgFrame();
        }
        if (document.getElementById('svg') && changes['isLoading']) {
            this.zoomIn();
        }
    }

    zoomIn() {
        document.getElementById('svg-container')?.scrollTo({
            left: 0,
            top: 0
        });
        const svg = document.getElementById('svg') as HTMLElement;
        if (svg) {
            this.renderer.setStyle(svg, 'width', 'auto');
            this.renderer.setStyle(svg, 'transform', 'scale(1)');
        }
    }

    generateSvgFrame() {
        this._setSvgMeasurements();
        this.numbersArray = this.generateArrayWithStep();
        if (this.filter.isCollapsed) {
            SVG_FRAME.maxHeight = 0.8;
            SVG_FRAME.minX = 0;
        }
        this.cdr.detectChanges(); // detect changes after empty machineW
    }

    _setSvgMeasurements() {
        SVG_FRAME.minX = this.filter.elements.reduce((minX, element) => {
            return Math.min(minX, element.upstreamX);
        }, Infinity);
        SVG_FRAME.minY = this.filter.elements[0].upstreamY;
        SVG_FRAME.maxHeight = 0;
        if (!this.filter.isCollapsed) {
            SVG_FRAME.maxWidth = this.filter.elements.reduce((maxX, element) => {
                return Math.max(maxX, element.downstreamX);
            }, -Infinity);
        }
        this.filter.elements.forEach((item: Element) => {
            SVG_FRAME.maxHeight = SVG_FRAME.maxHeight > item.height ? SVG_FRAME.maxHeight : item.height;
        });
        this._adjustSvgFrame();
    }

    _adjustSvgFrame() {
        if (SVG_FRAME.maxHeight < SVG_FRAME.maxDefaultHeight) {
            SVG_FRAME.maxHeight = SVG_FRAME.maxDefaultHeight;
        }
    }

    getCollapsedLength() {
        const filteredElements = this.filter.elements.filter(element => element.depthLevel === this.filter.depthLevels[0] && element.downstreamX < this.filter.positionRange[1]);
        return filteredElements.length + SVG_FRAME.svgPaddings * 2;
    }

  getExtendedLength(){
    return this.filter.positionRange[1] - this.filter.positionRange[0] + SVG_FRAME.svgPaddings * 2;
  }


    generateArrayWithStep(): number[] {
        const arr: number[] = [];
        for (let i = 0; i < SVG_FRAME.maxWidth; i += SVG_FRAME.arrayStep) {
            arr.push(i);
        }
        return arr;
    }
}
