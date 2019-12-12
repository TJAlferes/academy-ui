/**
 * @author alteredq / http://alteredqualia.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import {
	BufferGeometry,
	FileLoader,
	Float32BufferAttribute,
	Loader
} from "../../../build/three.module.js";

import CPK from './CPK';

var PDBLoader = function (manager) {
	Loader.call(this, manager);
};

PDBLoader.prototype = Object.assign(
  Object.create(Loader.prototype),
  {
    constructor: PDBLoader,

    load: function (url, onLoad, onProgress, onError) {
      var scope = this;
      var loader = new FileLoader(scope.manager);
      loader.setPath(scope.path);
      loader.load(url, function (text) {
        onLoad(scope.parse(text));
      }, onProgress, onError);
    },

    // Based on CanvasMol PDB parser
    parse: function (text) {

      function trim(text) {
        return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }

      function capitalize(text) {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
      }

      function hash(s, e) {
        return 's' + Math.min(s, e) + 'e' + Math.max(s, e);
      }

      function parseBond(start, length) {
        var eatom = parseInt(lines[i].substr(start, length));

        if (eatom) {
          var h = hash(satom, eatom);

          if (bhash[h] === undefined) {
            bonds.push([satom - 1, eatom - 1, 1]);
            bhash[h] = bonds.length - 1;
          } else {
            // doesn't really work as almost all PDBs
            // have just normal bonds appearing multiple
            // times instead of being double/triple bonds
            // bonds[bhash[h]][2] += 1;
          }
        }
      }

      function buildGeometry() {
        var build = {
          geometryAtoms: new BufferGeometry(),
          geometryBonds: new BufferGeometry(),
          json: {atoms: atoms, bonds: bonds}
        };

        var geometryAtoms = build.geometryAtoms;
        var geometryBonds = build.geometryBonds;

        var i;
        var l;

        var verticesAtoms = [];
        var colorsAtoms = [];
        var verticesBonds = [];

        // atoms
        
        for (i = 0, l = atoms.length; i < l; i ++) {
          var atom = atoms[i];

          var x = atom[0];
          var y = atom[1];
          var z = atom[2];

          verticesAtoms.push(x, y, z);

          var r = atom[3][0] / 255;
          var g = atom[3][1] / 255;
          var b = atom[3][2] / 255;

          colorsAtoms.push(r, g, b);
        }

        // bonds
        
        for (i = 0, l = bonds.length; i < l; i ++) {
          var bond = bonds[i];

          var start = bond[0];
          var end = bond[1];

          verticesBonds.push(verticesAtoms[(start * 3) + 0]);
          verticesBonds.push(verticesAtoms[(start * 3) + 1]);
          verticesBonds.push(verticesAtoms[(start * 3) + 2]);

          verticesBonds.push(verticesAtoms[(end * 3) + 0]);
          verticesBonds.push(verticesAtoms[(end * 3) + 1]);
          verticesBonds.push(verticesAtoms[(end * 3) + 2]);
        }

        // build geometry
        
        geometryAtoms.setAttribute(
          'position',
          new Float32BufferAttribute(verticesAtoms, 3)
        );
        geometryAtoms.setAttribute(
          'color',
          new Float32BufferAttribute(colorsAtoms, 3)
        );
        geometryBonds.setAttribute(
          'position',
          new Float32BufferAttribute(verticesBonds, 3)
        );

        return build;
      }

      var atoms = [];
      var bonds = [];
      var histogram = {};

      var bhash = {};

      var x, y, z, index, e;

      // parse

      var lines = text.split('\n');

      for (var i = 0, l = lines.length; i < l; i++) {

        if (
          lines[i].substr(0, 4) === 'ATOM' ||
          lines[i].substr(0, 6) === 'HETATM'
        ) {

          x = parseFloat(lines[i].substr(30, 7));
          y = parseFloat(lines[i].substr(38, 7));
          z = parseFloat(lines[i].substr(46, 7));
          index = parseInt(lines[i].substr(6, 5)) - 1;

          e = trim(lines[i].substr(76, 2)).toLowerCase();

          if (e === '') e = trim(lines[i].substr(12, 2)).toLowerCase();

          atoms[index] = [x, y, z, CPK[e], capitalize(e)];

          if (histogram[e] === undefined) histogram[e] = 1;
          else histogram[e] += 1;

        } else if (lines[i].substr(0, 6) === 'CONECT') {

          var satom = parseInt(lines[i].substr(6, 5));
          parseBond(11, 5);
          parseBond(16, 5);
          parseBond(21, 5);
          parseBond(26, 5);

        }
        
      }

      return buildGeometry();
    }
  }
);

export {PDBLoader};