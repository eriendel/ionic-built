import { Component, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class ToastCmp {
    constructor(_viewCtrl, _config, _elementRef, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        this._elementRef = _elementRef;
        this.dismissTimeout = undefined;
        renderer.setElementClass(_elementRef.nativeElement, `toast-${_config.get('mode')}`, true);
        this.d = params.data;
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(cssClass => {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++toastIds);
        if (this.d.message) {
            this.hdrId = 'toast-hdr-' + this.id;
        }
    }
    ngAfterViewInit() {
        // if there's a `duration` set, automatically dismiss.
        if (this.d.duration) {
            this.dismissTimeout = setTimeout(() => {
                this.dismiss('backdrop');
            }, this.d.duration);
        }
        this.enabled = true;
    }
    ionViewDidEnter() {
        const { activeElement } = document;
        if (activeElement) {
            activeElement.blur();
        }
        let focusableEle = this._elementRef.nativeElement.querySelector('button');
        if (focusableEle) {
            focusableEle.focus();
        }
    }
    cbClick() {
        if (this.enabled) {
            this.dismiss('close');
        }
    }
    dismiss(role) {
        clearTimeout(this.dismissTimeout);
        this.dismissTimeout = undefined;
        return this._viewCtrl.dismiss(null, role, { disableApp: false });
    }
}
ToastCmp.decorators = [
    { type: Component, args: [{
                selector: 'ion-toast',
                template: '<div class="toast-wrapper" ' +
                    '[class.toast-bottom]="d.position === \'bottom\'" ' +
                    '[class.toast-middle]="d.position === \'middle\'" ' +
                    '[class.toast-top]="d.position === \'top\'"> ' +
                    '<div class="toast-container"> ' +
                    '<div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div> ' +
                    '<button ion-button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()"> ' +
                    '{{ d.closeButtonText || \'Close\' }} ' +
                    '</button> ' +
                    '</div> ' +
                    '</div>',
                host: {
                    'role': 'dialog',
                    '[attr.aria-labelledby]': 'hdrId',
                    '[attr.aria-describedby]': 'descId',
                },
            },] },
];
/** @nocollapse */
ToastCmp.ctorParameters = () => [
    { type: ViewController, },
    { type: Config, },
    { type: ElementRef, },
    { type: NavParams, },
    { type: Renderer, },
];
let toastIds = -1;
//# sourceMappingURL=toast-component.js.map