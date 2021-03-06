﻿/// <reference path="../Common/Common.ts" />
/// <reference path="../Common/Entities/Entities.ts" />
module AsciiGame {
    import Entities = Common.Entities;
    import C = Common;

    export interface IDrawable {
        symbol: string;
        color?: string;
        bgColor?: string;
    }

    export function symbolO(item: C.IObject): string {
        throw("TODO");
    }

    export function colorO(item): ROT.Color {
        throw ("TODO");
    }

    export function symbolE(entity: C.IEntity): string {
        throw ("TODO");
    }

    export function colorE(entity): ROT.Color {
        throw ("TODO");
    }

    export function getDrawableE(entity: C.IEntity): IDrawable {
        if (entity instanceof Entities.PlayerChar) {
            return { symbol: "@" };
        }
        else {
            return { symbol: "e" };
        }
    }

    export function getDrawableO(obj: C.IObject) {
        if (obj instanceof C.Dungeon.ItemObject) {
            var i = <C.Dungeon.ItemObject>obj;
            if (i.item instanceof C.Items.ArmorPiece) {
                var a = <C.Items.ArmorPiece>i.item;
                return { symbol: "[", color: "blue" };
            }
            else if (i.item instanceof C.Items.Weapon) {
                var w = <C.Items.Weapon>i.item;
                return { symbol: ")", color: "green" };
            }
            else {
                return { symbol: "?" };
            }
        }
        else {
            return { symbol: "%", color: "red" };
        }
    }

    export function wrapString(str: string, limit: number): string[]{
        var arr = new Array<string>();
        var split = str.split(" ");
        function nextLine(words: string[], startIndex: number): any[] {
            var line = words[startIndex];
            var lt = words[startIndex].length;
            var i = startIndex + 1;
            var next = words[i];
            while (next && lt + next.length + 1 <= limit) {
                lt += next.length + 1;
                line += " " + next;
                i += 1;
                next = words[i];
            }

            return [line, i];
        }

        var wordsUsed = 0;
        while (wordsUsed < split.length) {
            var line = nextLine(split, wordsUsed);
            arr.push(line[0]);
            wordsUsed = line[1];
        }

        return arr;
    }

    export function mixColors(back: string, front: string, alpha: number): string {
        if (!back) back = "black";
        if (!front) front = "black";
        return ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(back), ROT.Color.fromString(front), alpha)));
    }
}