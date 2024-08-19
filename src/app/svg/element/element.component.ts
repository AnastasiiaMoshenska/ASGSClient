import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Element} from '../../models/models';
import {ELEMENT_COLLAPSED, ELEMENT, SVG_FRAME, VIEW_BOX} from '../../constants/constants';
import {Filter} from "../../filter/root-filter/root-filter.component";

interface Measurements {
  height: number;
  width: number;
  upstreamX: number;
  midstreamX: number;
  downstreamX: number;
  midstreamY: number
}

@Component({
  selector: 'g[lt-element]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnChanges{
  readonly FONT_SIZE_THRESHOLD = 8;
  readonly VIEW_BOX = VIEW_BOX;
  readonly SVG_FRAME = SVG_FRAME;
  readonly ELEMENT = ELEMENT;

  @Input() element!: Element;
  @Input() index!: number;
  @Input() filter!: Filter;

  adjMeasurements: Measurements = {
    height: 0,
    width: 0,
    upstreamX: 0,
    midstreamX: 0,
    downstreamX: 0,
    midstreamY: 0
  };


  mousePosition = {
    x: 0,
    y: 0
  };


  ngOnChanges() {
    if (this.filter.isCollapsed) {
      this.adjMeasurements.height = ELEMENT_COLLAPSED.height;
      this.adjMeasurements.width = ELEMENT_COLLAPSED.width;
      this.adjMeasurements.upstreamX = this.index;
      this.adjMeasurements.midstreamX = this.index + this.adjMeasurements.width / 2;
      this.adjMeasurements.downstreamX = this.index + this.adjMeasurements.width;
      this.adjMeasurements.midstreamY = 0;
    } else {
      this.adjMeasurements.height = this.element.height;
      this.adjMeasurements.width = this.element.width;
      this.adjMeasurements.upstreamX = this.element.upstreamX != null && this.element.downstreamX != null ? this.element.upstreamX : this.element.midstreamX;
      this.adjMeasurements.midstreamY = this.element.midstreamY;
      this.adjMeasurements.midstreamX = this.element.midstreamX;
      this.adjMeasurements.downstreamX = this.element.upstreamX != null && this.element.downstreamX != null ? this.element.downstreamX : this.element.midstreamX;
    }

    if (this.filter.isDefaultHeightAdded && this.element.height === 0 && this.element.width !== 0 && !this.filter.isCollapsed) {
      this.adjMeasurements.height = 0.5
    }
  }

  calculateFontSize() {
    const calculatedFontSize = this.adjMeasurements.width > this.FONT_SIZE_THRESHOLD ? 1 : this.adjMeasurements.width / this.FONT_SIZE_THRESHOLD;
    if (calculatedFontSize > ELEMENT.maxFontSize) {
      return ELEMENT.maxFontSize;
    } else if (calculatedFontSize < ELEMENT.minFontSize) {
      return ELEMENT.minFontSize;
    } else {
      return calculatedFontSize;
    }
  }

  calculateYposition() {
    if (this.filter.isCollapsed) {
      return ELEMENT_COLLAPSED.titlePosition;
    } else {
      return -this.adjMeasurements.height / 2 - this.calculateFontSize();
    }
  }

  shouldRenderElement(element: Element): boolean {
    return (
      ((this.filter.activeClasses.includes(element.mainClass) || element.mainClass == null) &&
        this.filter.depthLevels.includes(element.depthLevel) &&
        !this.filter.isCollapsed) ||
      ((this.filter.activeClasses.includes(element.mainClass) || element.mainClass == null) &&
        this.filter.isCollapsed &&
        this.filter.depthLevels[0] === element.depthLevel &&
        element.upstreamX >= this.filter.positionRange[0] &&
        element.upstreamX <= this.filter.positionRange[1])
    );
  }

  mouseDown($event: MouseEvent) {
    this.mousePosition.x = $event.screenX;
    this.mousePosition.y = $event.screenY;
  }

  mouseUp($event: MouseEvent) {
    if (this.mousePosition.x === $event.screenX) {
      window.open('elements?id=' + this.element.elementId, '_blank');
    }
  }
}
