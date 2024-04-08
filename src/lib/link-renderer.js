/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { path } from "d3-path";


const constant = x => () => x;

export function halfLink() {
  var _source = link => link.source;
  var _target = link => link.target;
  var _nodeRadius = node => node.size || 10;
  var _nodeX = node => node.x;
  var _nodeY = node => node.y;
  var _width = link => link.width || 10;
  var _bend = link => link.bend || 30;
  var _oppositeLink = link => null;

  function renderHalfLink(link) {
    const source = _source(link);
    const target = _target(link);
    const x0 = _nodeX(source);
    const y0 = _nodeY(source);
    const r0 = _nodeRadius(source);
    const x1 = _nodeX(target);
    const y1 = _nodeY(target);
    const r1 = _nodeRadius(target);
    const width = _width(link);
    const oppositeLink = _oppositeLink(link);
    const oppositeWidth = oppositeLink ? _width(oppositeLink) : width;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const l = Math.sqrt(dx * dx + dy * dy);
    const lBetween = l - r0 - r1;
    const bend = _bend(link, lBetween);

    // Skip draw link of nodes overlap if not big bend
    if (lBetween <= 0 && Math.abs(bend) < 50) {
      return "";
    }

    // Get unit vector in direction and perpendicular
    const dir = { x: dx / l, y: dy / l };
    const right = { x: -dir.y, y: dir.x };

    // Size of arrowhead
    const tipLength = Math.min(lBetween / 2, 10 * Math.pow(width, 1 / 3));
    const tipWidth = 2 * Math.pow(width, 1 / 2); // excluding the line width

    // Size of opposite arrowhead
    const oppositeTipLength = Math.min(lBetween / 2, 10 * Math.pow(oppositeWidth, 1 / 3));

    // Bending
    const bendMagnitude = Math.abs(bend);
    const outerBendAddition = Math.pow(bendMagnitude / 10, 0.4);
    const positiveCurvature = dir.x > 0 || (dir.x === 0 && dir.y < 0);
    const curvatureSign = positiveCurvature ? 1 : -1;
    const bendSign = bend > 0 ? 1 : -1;
    const finalBendSign = curvatureSign * bendSign;
    const signedBend = finalBendSign * bendMagnitude;

    // Calculate the end points for the middle bezier curve. Rotate them towards the control point later.
    const x02tmp = x0 + (r0 + oppositeTipLength) * dir.x;
    const y02tmp = y0 + (r0 + oppositeTipLength) * dir.y;
    const x12tmp = x1 - (r1 + tipLength) * dir.x;
    const y12tmp = y1 - (r1 + tipLength) * dir.y;

    const xMidpoint = 0.5 * (x02tmp + x12tmp);
    const yMidpoint = 0.5 * (y02tmp + y12tmp);
    const xCP1 = xMidpoint + signedBend * right.x;
    const yCP1 = yMidpoint + signedBend * right.y;
    const xCP2 = xMidpoint + (signedBend + width + outerBendAddition) * right.x;
    const yCP2 = yMidpoint + (signedBend + width + outerBendAddition) * right.y;

    // points from source to control point
    const dx1 = xCP1 - x0;
    const dy1 = yCP1 - y0;
    const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const dir0 = { x: dx1 / l1, y: dy1 / l1 };
    const right0 = { x: -dir0.y, y: dir0.x };
    const x01 = x0 + r0 * dir0.x;
    const y01 = y0 + r0 * dir0.y;
    const x02 = x01 + oppositeTipLength * dir0.x;
    const y02 = y01 + oppositeTipLength * dir0.y;
    const x03 = x02 + width * right0.x;
    const y03 = y02 + width * right0.y;
    const x04 = x0 + width * right0.x;
    const y04 = y0 + width * right0.y;

    // points from target to control point
    const dx2 = xCP1 - x1;
    const dy2 = yCP1 - y1;
    const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const dir1 = { x: dx2 / l2, y: dy2 / l2 };
    const x11 = x1 + r1 * dir1.x;
    const y11 = y1 + r1 * dir1.y;
    const x12 = x11 + tipLength * dir1.x;
    const y12 = y11 + tipLength * dir1.y;
    const left1 = { x: dir1.y, y: -dir1.x };
    const x13 = x12 + width * left1.x;
    const y13 = y12 + width * left1.y;
    const x14 = x13 + tipWidth * left1.x;
    const y14 = y13 + tipWidth * left1.y;

    const p = path();
    p.moveTo(x02, y02);
    p.lineTo(x0, y0);
    p.lineTo(x04, y04);
    p.lineTo(x03, y03);
    p.quadraticCurveTo(xCP2, yCP2, x13, y13);
    p.lineTo(x14, y14);
    p.lineTo(x11, y11);
    p.lineTo(x12, y12);
    p.quadraticCurveTo(xCP1, yCP1, x02, y02);
    p.closePath();
    return p.toString();
  }

  renderHalfLink.source = function(_) {
    return arguments.length ? (_source = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _source;
  };
  renderHalfLink.target = function(_) {
    return arguments.length ? (_target = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _target;
  };
  renderHalfLink.nodeRadius = function(_) {
    return arguments.length ? (_nodeRadius = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _nodeRadius;
  };
  renderHalfLink.nodeX = function(_) {
    return arguments.length ? (_nodeX = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _nodeX;
  };
  renderHalfLink.nodeY = function(_) {
    return arguments.length ? (_nodeY = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _nodeY;
  };
  renderHalfLink.width = function(_) {
    return arguments.length ? (_width = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _width;
  };
  renderHalfLink.bend = function(_) {
    return arguments.length ? (_bend = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _bend;
  };
  renderHalfLink.oppositeLink = function(_) {
    return arguments.length ? (_oppositeLink = typeof _ === "function" ? _ : constant(_), renderHalfLink) : _oppositeLink;
  };

  return renderHalfLink;
}

export function undirectedLink() {
  let _source = link => link.source;
  let _target = link => link.target;
  let _nodeRadius = node => node.size || 10;
  let _nodeX = node => node.x;
  let _nodeY = node => node.y;
  let _width = link => link.width || 10;
  let _bend = link => link.bend || 30;

  function renderUndirectedLink(link) {
    const source = _source(link);
    const target = _target(link);
    const x0 = _nodeX(source);
    const y0 = _nodeY(source);
    const r0 = _nodeRadius(source);
    const x1 = _nodeX(target);
    const y1 = _nodeY(target);
    const r1 = _nodeRadius(target);
    const width = _width(link);
    const dx = x1 - x0;
    const dy = y1 - y0;
    const l = Math.sqrt(dx * dx + dy * dy);
    const lBetween = l - r0 - r1;
    const bend = _bend(link, lBetween);

    // Skip draw link of nodes overlap if not big bend
    if (lBetween <= 0 && Math.abs(bend) < 50) {
      return "";
    }

    // Get unit vector in direction and perpendicular
    const dir = { x: dx / l, y: dy / l };
    const right = { x: -dir.y, y: dir.x };

    // Bending
    const bendMagnitude = Math.abs(bend);
    const outerBendAddition = Math.pow(bendMagnitude / 10, 0.4);
    const positiveCurvature = dir.x > 0 || (dir.x === 0 && dir.y < 0);
    const curvatureSign = positiveCurvature ? 1 : -1;
    const bendSign = bend > 0 ? 1 : -1;
    const finalBendSign = curvatureSign * bendSign;
    const signedBend = finalBendSign * bendMagnitude;

    // Calculate the end points for the middle bezier curve. Rotate them towards the control point later.
    const x02tmp = x0 + r0 * dir.x;
    const y02tmp = y0 + r0 * dir.y;
    const x12tmp = x1 - r1 * dir.x;
    const y12tmp = y1 - r1 * dir.y;

    const xMidpoint = 0.5 * (x02tmp + x12tmp);
    const yMidpoint = 0.5 * (y02tmp + y12tmp);
    const xCP1 = xMidpoint + signedBend * right.x;
    const yCP1 = yMidpoint + signedBend * right.y;
    const xCP2 = xMidpoint + (signedBend + width + outerBendAddition) * right.x;
    const yCP2 = yMidpoint + (signedBend + width + outerBendAddition) * right.y;

    const halfWidth = 0.5 * width;

    // points from source to control point
    const dx1 = xCP1 - x0;
    const dy1 = yCP1 - y0;
    const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const dir0 = { x: dx1 / l1, y: dy1 / l1 };
    const right0 = { x: -dir0.y, y: dir0.x };
    const x01 = x0 - halfWidth * right0.x;
    const y01 = y0 - halfWidth * right0.y;
    const x02 = x0 + halfWidth * right0.x;
    const y02 = y0 + halfWidth * right0.y;

    // points from target to control point
    const dx2 = xCP1 - x1;
    const dy2 = yCP1 - y1;
    const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const dir1 = { x: dx2 / l2, y: dy2 / l2 };
    const left1 = { x: dir1.y, y: -dir1.x };
    const x11 = x1 - halfWidth * left1.x;
    const y11 = y1 - halfWidth * left1.y;
    const x12 = x1 + halfWidth * left1.x;
    const y12 = y1 + halfWidth * left1.y;

    const p = path();
    p.moveTo(x01, y01);
    p.lineTo(x02, y02);
    p.quadraticCurveTo(xCP2, yCP2, x12, y12);
    p.lineTo(x11, y11);
    p.quadraticCurveTo(xCP1, yCP1, x01, y01);
    p.closePath();
    return p.toString();
  }

  renderUndirectedLink.source = function(_) {
    return arguments.length ? (_source = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _source;
  };
  renderUndirectedLink.target = function(_) {
    return arguments.length ? (_target = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _target;
  };
  renderUndirectedLink.nodeRadius = function(_) {
    return arguments.length ? (_nodeRadius = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _nodeRadius;
  };
  renderUndirectedLink.nodeX = function(_) {
    return arguments.length ? (_nodeX = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _nodeX;
  };
  renderUndirectedLink.nodeY = function(_) {
    return arguments.length ? (_nodeY = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _nodeY;
  };
  renderUndirectedLink.width = function(_) {
    return arguments.length ? (_width = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _width;
  };
  renderUndirectedLink.bend = function(_) {
    return arguments.length ? (_bend = typeof _ === "function" ? _ : constant(_), renderUndirectedLink) : _bend;
  };

  return renderUndirectedLink;
}

const networkRendering = {
  halfLink,
  undirectedLink
};

export default networkRendering;

