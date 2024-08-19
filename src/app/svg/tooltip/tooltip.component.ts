import {Component, Input} from '@angular/core';
import { Element} from '../../models/models';
import { ELEMENT, SVG_FRAME, TOOLTIP, VIEW_BOX } from '../../constants/constants';

@Component({
    selector: 'g[lt-tooltip]',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
    @Input() element!: Element;
    @Input() adjMeasurements!: { height: number; width: number; upstreamX: number; midstreamX: number; downstreamX: number; midstreamY: number };
    @Input() isLabelShown!: boolean;
    @Input() isExpertShown!: boolean;

    readonly VIEW_BOX = VIEW_BOX;
    readonly SVG_FRAME = SVG_FRAME;
    readonly TOOLTIP = TOOLTIP;
    readonly ELEMENT = ELEMENT;

    mousePosition = {
        x: 0,
        y: 0
    };

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
