﻿module Common {

    export class Vec {
        static get East() {
            return { x: 1, y: 0 };
        }
        static get West() {
            return { x: -1, y: 0 };
        }
        static get North() {
            return { x: 0, y: -1 };
        }
        static get South() {
            return { x: 0, y: 1 };
        }
        static get Southeast() {
            return { x: 1, y: 1 };
        }
        static get Northwest() {
            return { x: -1, y: -1 };
        }
        static get Northeast() {
            return { x: 1, y: -1 };
        }
        static get Southwest() {
            return { x: -1, y: 1 };
        }

        static isEqual(a: IVector2, b: IVector2) {
            return a.x == b.x && a.y == b.y;
        }

        static add(a: IVector2, b: IVector2): IVector2 {
            return { x: a.x + b.x, y: a.y + b.y };
        }
        static sub(a: IVector2, b: IVector2): IVector2 {
            return { x: a.x - b.x, y: a.y - b.y };
        }
        static mul(a: IVector2, b: number): IVector2 {
            return { x: b * a.x, y: b * a.y };
        }
    }
} 