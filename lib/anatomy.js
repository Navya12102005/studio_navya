// Portfolio mappings for the imported upper-body BodyParts3D asset.
// Asset provenance and licensing are recorded under public/models/.
export const anatomicalParts = {
  brain: { label: 'Cranial / cerebral', title: 'Where patterns begin.', description: 'Paired cerebral hemispheres within the cranial vault.', readout: '2 HEMISPHERES · CRANIAL VAULT', domain: 'tech', action: 'Explore Tech & Bioengineering' },
  spine: { label: 'Cervical / thoracic', title: 'The connecting structure.', description: 'Seven cervical levels connect the cranium to twelve thoracic levels.', readout: 'C1-C7 · T1-T12', domain: 'creative', action: 'Explore leadership & strategy' },
  heart: { label: 'Thoracic / cardiac', title: 'Where intention takes shape.', description: 'A left-of-midline heart core framed by twelve rib pairs.', readout: '7 TRUE · 3 FALSE · 2 FLOATING RIB PAIRS', domain: 'creative', action: 'Explore Creative, PR & Strategy' },
  vascular: { label: 'Vascular / connected flow', title: 'Keeping everything moving.', description: 'A branching transport network, used here as a metaphor for operational coordination.', readout: 'OPERATIONS · PEOPLE · EVENT LOGISTICS', domain: 'creative', project: 'aws', action: 'View operational leadership' },
  cell: { label: 'Cellular / lipid bilayer', title: 'A world within a membrane.', description: 'A stylized double membrane of phospholipid heads and connecting tails.', readout: 'CELLULAR STUDY · MOLECULAR SYSTEMS', domain: 'tech', project: 'docking', action: 'Explore molecular workflows' },
  ligand: { label: 'Molecular / ligand', title: 'A structure with potential.', description: 'A rotating molecular form linking structural curiosity to a computational workflow.', readout: 'ILLUSTRATIVE LIGAND · NOT A VALIDATED COMPOUND', domain: 'tech', project: 'docking', action: 'View molecular docking study' }
};
export const vertebralLevels = [
  ...Array.from({ length: 7 }, (_, i) => ({ label: `C${i + 1}`, region: 'cervical', y: 1.63 - i * .083, width: .073 + i * .002, z: -.18 + Math.sin(i / 6 * Math.PI) * .045 })),
  ...Array.from({ length: 12 }, (_, i) => ({ label: `T${i + 1}`, region: 'thoracic', y: .98 - i * .223, width: .09 + i * .003, z: -.22 - Math.sin(i / 11 * Math.PI) * .13 }))
];
export const ribPairs = Array.from({ length: 12 }, (_, i) => ({
  level: i + 1, type: i < 7 ? 'true' : i < 10 ? 'false' : 'floating',
  y: 1.03 - i * .205,
  width: .58 + Math.sin((i + 1) / 14 * Math.PI) * .65 - Math.max(0, i - 8) * .07
}));
