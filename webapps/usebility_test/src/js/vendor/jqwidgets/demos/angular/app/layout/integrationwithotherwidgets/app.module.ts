import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LayoutModule } from '../../modules/layout.module';
import { TreeModule } from '../../modules/tree.module';
import { TextAreaModule } from '../../modules/textarea.module';
import { ChartModule } from '../../modules/chart.module';
import { MenuModule } from '../../modules/menu.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, CommonModule, LayoutModule, TreeModule, TextAreaModule, ChartModule, MenuModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }