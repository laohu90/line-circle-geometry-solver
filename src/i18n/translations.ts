/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'zh';

export interface TranslationSchema {
  // Brand & Header
  appName: string;
  appShortName: string;
  tagline: string;
  navSolver: string;
  navCanvas: string;
  navNotebook: string;
  navCheatsheet: string;
  navToolbox: string;
  btnAddNotebook: string;
  btnReset: string;
  btnCopySolution: string;
  btnCopied: string;
  btnExportSvg: string;

  // Language names
  langEn: string;
  langEs: string;
  langFr: string;
  langPt: string;
  langZh: string;

  // Verdict & Summary Card
  summaryCardTitle: string;
  summaryCardSub: string;
  metricCenter: string;
  metricRadius: string;
  metricDistance: string;
  metricChordOrExtrema: string;
  verdictLabel: string;
  verdictSecant: string;
  verdictTangent: string;
  verdictDisjoint: string;
  verdictSecantDesc: string;
  verdictTangentDesc: string;
  verdictDisjointDesc: string;
  fastAnswerLabel: string;
  exactValueLabel: string;

  // Inputs
  circleInputHeader: string;
  circleGeneralTab: string;
  circleStandardTab: string;
  lineInputHeader: string;
  lineGeneralTab: string;
  lineSlopeTab: string;
  linePointSlopeTab: string;
  currentEquation: string;
  currentLineEquation: string;
  conditionCheck: string;
  validCircle: string;
  pointCircle: string;
  imaginaryCircle: string;
  verticalLineCheck: string;
  presetSectionTitle: string;
  quickParsePlaceholder: string;
  btnQuickParse: string;
  quickParseSuccess: string;
  quickParseError: string;
  quickParseEmptyError: string;

  // Parameter Slider / Dynamic Explorer
  sliderTitle: string;
  sliderSub: string;
  sliderParamC: string;
  sliderParamK: string;
  criticalValuesTitle: string;

  // Canvas
  canvasAuxToggle: string;
  canvasExtremaToggle: string;
  canvasResetView: string;
  canvasZoomIn: string;
  canvasZoomOut: string;
  canvasHint: string;
  canvasScale: string;
  pointCenterLabel: string;
  pointFootLabel: string;
  pointTangentLabel: string;
  chordLabel: string;
  nearPointLabel: string;
  farPointLabel: string;

  // Detailed Steps
  stepsHeader: string;
  stepsSub: string;
  tabAllSteps: string;
  tabSquareStep: string;
  tabDistanceStep: string;
  tabChordStep: string;
  tabAlgebraicStep: string;

  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  step6Title: string;
  step6Desc: string;

  geometricMethodTitle: string;
  geometricMethodBadge: string;
  geometricMethodDesc: string;
  algebraicMethodTitle: string;
  algebraicMethodBadge: string;
  algebraicMethodDesc: string;
  dualMethodVerifyNotice: string;
  intersectionCoordsTitle: string;
  extremaDistancesTitle: string;
  trianglePropertiesTitle: string;
  noChordTriangle: string;
  areaTriangleOAB: string;
  subtendedAngle: string;
  footPerpendicularDesc: string;
  distanceFormulaExplanation: string;

  // High School Geometry Toolbox
  toolboxTitle: string;
  toolboxSub: string;
  toolPointCircleTitle: string;
  toolPointCircleDesc: string;
  toolTangentTitle: string;
  toolTangentDesc: string;
  toolTwoCirclesTitle: string;
  toolTwoCirclesDesc: string;
  toolMidpointChordTitle: string;
  toolMidpointChordDesc: string;

  // Notebook
  notebookTitle: string;
  notebookSub: string;
  notebookCountText: string;
  btnSaveCurrent: string;
  btnPrint: string;
  btnExportJson: string;
  btnImportJson: string;
  searchPlaceholder: string;
  filterAll: string;
  filterUnmastered: string;
  filterMastered: string;
  filterAllTags: string;
  noQuestionsFound: string;
  noQuestionsSub: string;
  noteLabel: string;
  noNoteText: string;
  btnLoadIntoSolver: string;
  btnDelete: string;
  btnEditNote: string;
  btnSaveNote: string;
  btnCancel: string;
  statusMastered: string;
  statusUnmastered: string;

  // Save Modal
  modalTitle: string;
  modalFieldTitle: string;
  modalFieldTitlePlaceholder: string;
  modalFieldTag: string;
  modalFieldCustomTag: string;
  modalFieldNote: string;
  modalFieldNotePlaceholder: string;
  btnConfirmSave: string;

  // Keywords Glossary
  glossaryTitle: string;
  glossarySub: string;
  keywordsTagSecant: string;
  keywordsTagTangent: string;
  keywordsTagDisjoint: string;
  keywordsTagSquare: string;
  keywordsTagChord: string;
  keywordsTagExtrema: string;
  keywordsTagExam: string;
  keywordsTagVertical: string;

  // Cheatsheet
  cheatTitle: string;
  cheatSub: string;
  model1Title: string;
  model1Desc: string;
  model1Tip: string;
  model2Title: string;
  model2Desc: string;
  model2Tip: string;
  model3Title: string;
  model3Desc: string;
  model3Tip: string;
  model4Title: string;
  model4Desc: string;
  model4Tip: string;

  // Footer
  footerDisclaimer: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationSchema> = {
  en: {
    appName: 'Line & Circle Analyzer',
    appShortName: 'Geometry Solver',
    tagline: 'High-School & College Analytical Geometry Assistant: Completing the Square, Positional Relation & Chord Length Solver',
    navSolver: 'Step-by-Step Solver',
    navCanvas: 'Interactive Canvas',
    navNotebook: 'Problem Notebook',
    navCheatsheet: 'Formulas & Cheatsheet',
    navToolbox: 'Geometry Toolbox',
    btnAddNotebook: 'Save Problem',
    btnReset: 'Reset',
    btnCopySolution: 'Copy Solution',
    btnCopied: 'Copied!',
    btnExportSvg: 'Export Diagram',

    langEn: 'English',
    langEs: 'Español',
    langFr: 'Français',
    langPt: 'Português',
    langZh: '中文',

    summaryCardTitle: 'Positional Relation & Distance Card',
    summaryCardSub: 'Instant verification of center distance d versus radius R and chord length',
    metricCenter: 'Center O(x₀, y₀)',
    metricRadius: 'Radius R',
    metricDistance: 'Center Distance d',
    metricChordOrExtrema: 'Chord Length L',
    verdictLabel: 'Relation',
    verdictSecant: 'Secant (Intersecting)',
    verdictTangent: 'Tangent',
    verdictDisjoint: 'Exterior (Disjoint)',
    verdictSecantDesc: 'Center distance d < R: The line intersects the circle at 2 distinct real points.',
    verdictTangentDesc: 'Center distance d = R: The line is tangent to the circle at exactly 1 contact point.',
    verdictDisjointDesc: 'Center distance d > R: The line lies completely outside the circle with 0 intersection points.',
    fastAnswerLabel: 'Key Exam Takeaway',
    exactValueLabel: 'Exact Radical Form',

    circleInputHeader: 'Circle Equation Input',
    circleGeneralTab: 'General: x² + y² + Dx + Ey + F = 0',
    circleStandardTab: 'Standard: (x - x₀)² + (y - y₀)² = R²',
    lineInputHeader: 'Line Equation Input',
    lineGeneralTab: 'General: Ax + By + C = 0',
    lineSlopeTab: 'Slope-Intercept: y = kx + b',
    linePointSlopeTab: 'Point-Slope',
    currentEquation: 'Current Circle Equation:',
    currentLineEquation: 'Current Line Equation:',
    conditionCheck: 'Existence Condition: D² + E² - 4F =',
    validCircle: '✓ Valid Real Circle',
    pointCircle: '⚠ Degenerates to a single point',
    imaginaryCircle: '✗ Imaginary circle (no real locus)',
    verticalLineCheck: 'Vertical line (slope undefined: x = c)',
    presetSectionTitle: 'Classic Exam Presets & Templates:',
    quickParsePlaceholder: 'Paste equation (e.g. x^2+y^2-4x+2y-4=0 or 3x+4y=12 or y=2x-1)...',
    btnQuickParse: 'Auto Parse',
    quickParseSuccess: 'Successfully parsed and updated equations!',
    quickParseError: 'Could not recognize equation format. Please check syntax.',
    quickParseEmptyError: 'Please enter an equation (e.g. x^2+y^2-2x+4y-4=0 or 3x+4y-12=0).',

    sliderTitle: 'Dynamic Parameter Exploration',
    sliderSub: 'Drag the parameter slider to observe live transitions between Secant, Tangent, and Disjoint states',
    sliderParamC: 'Constant Offset C',
    sliderParamK: 'Slope k',
    criticalValuesTitle: 'Critical Tangent Values (d = R)',

    canvasAuxToggle: 'Auxiliary Lines',
    canvasExtremaToggle: 'Extrema Points',
    canvasResetView: 'Reset View',
    canvasZoomIn: 'Zoom In',
    canvasZoomOut: 'Zoom Out',
    canvasHint: 'Mouse wheel to zoom · Drag canvas to pan · Drag circle center to test live',
    canvasScale: 'Scale: 1 grid =',
    pointCenterLabel: 'Center',
    pointFootLabel: 'Foot H',
    pointTangentLabel: 'Tangent Point T',
    chordLabel: 'Chord',
    nearPointLabel: 'Closest Point (d_min)',
    farPointLabel: 'Farthest Point (d_max)',

    stepsHeader: 'Detailed Step-by-Step Derivation',
    stepsSub: 'Completing the square breakdown · Distance formula · Geometric vs Algebraic chord proofs',
    tabAllSteps: 'Complete Steps',
    tabSquareStep: 'Completing the Square',
    tabDistanceStep: 'Distance d to Line',
    tabChordStep: 'Chord Theorem',
    tabAlgebraicStep: 'Vieta Comparison',

    step1Title: 'Step 1: Grouping Variables and Moving Constant',
    step1Desc: 'Group x-terms and y-terms separately in brackets and move the constant term F to the right side (sign becomes -F).',
    step2Title: 'Step 2: Completing the Square (Add Half-Coefficients Squared)',
    step2Desc: 'Using the algebraic identity (x + a)² = x² + 2ax + a², add (D/2)² to x and (E/2)² to y on both sides of the equation.',
    step3Title: 'Step 3: Factoring into Standard Circle Form',
    step3Desc: 'Factor both groups into perfect squares and sum the right-hand constant terms.',
    step4Title: 'Step 4: Discriminant Check & Extracting Center and Radius',
    step4Desc: 'Verify D² + E² - 4F > 0 to confirm a real circle, then extract center coordinates and radius.',
    step5Title: 'Step 5: Point-to-Line Distance Formula Calculation',
    step5Desc: 'Substitute center coordinates (x₀, y₀) into the normalized general line equation Ax + By + C = 0.',
    step6Title: 'Step 6: Positional Relation Classification Matrix',
    step6Desc: 'Compare center distance d directly with radius R to determine the geometric relationship.',

    geometricMethodTitle: 'Method 1: Geometric Method (Perpendicular Chord Theorem & Pythagoras)',
    geometricMethodBadge: 'Exam Recommended',
    geometricMethodDesc: 'In right-angled triangle Rt△OHA formed by center O, perpendicular foot H, and chord endpoint A, Pythagoras yields: R² = d² + (L/2)². Hence chord length L = 2√(R² - d²).',
    algebraicMethodTitle: 'Method 2: Algebraic Elimination & Vieta\'s Formulas',
    algebraicMethodBadge: 'Standard Exam Proof',
    algebraicMethodDesc: 'Eliminate y by substituting the line equation into the circle equation, obtaining a quadratic equation ax² + bx + c = 0. Calculate discriminant Δ > 0 and evaluate chord length L = √(1 + k²)|x₁ - x₂|.',
    dualMethodVerifyNotice: 'Dual-Proof Verification: Both the geometric chord theorem and the algebraic elimination method produce identical results!',
    intersectionCoordsTitle: 'Exact Coordinates of Intersection / Contact Points:',
    extremaDistancesTitle: 'Extreme Distances from Points on Circle to the Line:',
    trianglePropertiesTitle: 'Chord Triangle Geometric Properties:',
    noChordTriangle: 'Line does not intersect circle; no chord triangle formed.',
    areaTriangleOAB: 'Area of △OAB:',
    subtendedAngle: 'Subtended Angle θ:',
    footPerpendicularDesc: 'Foot of perpendicular from center onto line (Chord Midpoint M):',
    distanceFormulaExplanation: 'The numerator is the absolute value of the line evaluated at center; denominator is the normal vector magnitude.',

    toolboxTitle: 'Advanced High School Geometry Toolbox',
    toolboxSub: 'Essential college-entrance exam models: Tangents, Point-to-Circle Extrema, Two-Circle Relations & Midpoint Chords',
    toolPointCircleTitle: 'Point vs. Circle & Extrema',
    toolPointCircleDesc: 'Determine if a point P(x, y) is inside, on, or outside the circle, and compute min/max distances to the circumference.',
    toolTangentTitle: 'Circle Tangent Solver',
    toolTangentDesc: 'Find tangent equations from a point on or outside the circle, tangent lengths, and chord of contact.',
    toolTwoCirclesTitle: 'Two Circles Positional Relation',
    toolTwoCirclesDesc: 'Analyze 5 positional relationships (exterior, externally tangent, secant, internally tangent, interior) and common chord line.',
    toolMidpointChordTitle: 'Midpoint Chord & Point Difference (点差法)',
    toolMidpointChordDesc: 'Given chord midpoint M(x_m, y_m), determine the chord line equation using k_OM · k_AB = -1.',

    notebookTitle: 'Problem Notebook & Exam Collection',
    notebookSub: 'Save difficult problems, record common pitfalls, search keywords, and export printable sheets',
    notebookCountText: 'problems saved',
    btnSaveCurrent: 'Save Current Problem',
    btnPrint: 'Print Sheet',
    btnExportJson: 'Export Backup',
    btnImportJson: 'Import Backup',
    searchPlaceholder: 'Search by title, keywords, tags, or equations...',
    filterAll: 'All',
    filterUnmastered: 'Needs Review',
    filterMastered: 'Mastered',
    filterAllTags: 'All Tags',
    noQuestionsFound: 'No matching problems found',
    noQuestionsSub: 'Try adjusting your search query or save the current problem from the solver.',
    noteLabel: 'Mistake Note & Key Takeaway:',
    noNoteText: 'No note added yet. Click the edit icon to add your reflections.',
    btnLoadIntoSolver: 'Load into Solver',
    btnDelete: 'Delete',
    btnEditNote: 'Edit Note',
    btnSaveNote: 'Save Note',
    btnCancel: 'Cancel',
    statusMastered: 'Mastered',
    statusUnmastered: 'Needs Review',

    modalTitle: 'Save Problem to Notebook',
    modalFieldTitle: 'Problem Title / Exam Source',
    modalFieldTitlePlaceholder: 'e.g. 2024 College Entrance Exam Analytic Geometry Q15',
    modalFieldTag: 'Concept Tag',
    modalFieldCustomTag: 'Custom Tag...',
    modalFieldNote: 'Common Mistake & Reflection (Optional)',
    modalFieldNotePlaceholder: 'Write down what tripped you up, edge cases to watch for, or mental shortcuts...',
    btnConfirmSave: 'Save Problem',

    glossaryTitle: 'Key Concepts & Keywords Glossary',
    glossarySub: 'Essential geometric theorems frequently tested in college prep exams',
    keywordsTagSecant: 'Secant & Chord',
    keywordsTagTangent: 'Tangent & Contact',
    keywordsTagDisjoint: 'Exterior & Extrema',
    keywordsTagSquare: 'Completing Square',
    keywordsTagChord: 'Perpendicular Chord',
    keywordsTagExtrema: 'Distance Extrema',
    keywordsTagExam: 'Exam Question',
    keywordsTagVertical: 'Vertical Line x=c',

    cheatTitle: 'High School & College Analytical Geometry Core Models',
    cheatSub: 'Proven exam shortcuts, critical formulas, and high-frequency problem structures',
    model1Title: 'Model 1: Perpendicular Chord Theorem (Pythagorean Triangle)',
    model1Desc: 'The perpendicular from the center to a chord bisects the chord. Radius R, center distance d, and half-chord L/2 form a right triangle: R² = d² + (L/2)², yielding L = 2√(R² - d²).',
    model1Tip: 'Common Trap: Do not confuse half-chord √(R² - d²) with the full chord L. Remember to multiply by 2. When d = 0, the chord reaches its maximum length: the diameter 2R.',
    model2Title: 'Model 2: General Equation to Standard Form Conversion',
    model2Desc: 'Every circle equation x² + y² + Dx + Ey + F = 0 can be converted to standard form (x + D/2)² + (y + E/2)² = (D² + E² - 4F)/4 via completing the square.',
    model2Tip: 'Critical Condition: A real circle requires D² + E² - 4F > 0. If equal to 0, it degenerates to a single point; if negative, no real locus exists.',
    model3Title: 'Model 3: Minimum & Maximum Distance from Circle to Line',
    model3Desc: 'Draw a perpendicular line from the center to the line. The two intersection points with the circle provide the absolute minimum and maximum distances: d_min = |d - R|, d_max = d + R.',
    model3Tip: 'Exam Shortcut: If the line intersects the circle (d < R), the minimum distance is 0, while the maximum distance remains d + R.',
    model4Title: 'Model 4: The Undefined Slope Trap (Vertical Line x = c)',
    model4Desc: 'When expressing lines as y = kx + b or y - y₀ = k(x - x₀), always check whether the vertical line x = c is a valid solution.',
    model4Tip: 'Best Practice: Formulating with general form Ax + By + C = 0 inherently covers vertical lines and eliminates the need for piecewise casework.',

    footerDisclaimer: 'Pure White Clean UI · KaTeX High-Precision Mathematical Typography · Local Persistent Storage',
  },

  es: {
    appName: 'Analizador Recta y Circunferencia',
    appShortName: 'Geometría Analítica',
    tagline: 'Asistente de Geometría Analítica: Completar el Cuadrado, Posición Relativa y Longitud de Cuerda',
    navSolver: 'Resolución Paso a Paso',
    navCanvas: 'Lienzo Interactivo',
    navNotebook: 'Cuaderno de Problemas',
    navCheatsheet: 'Fórmulas y Chuleta',
    navToolbox: 'Herramientas Geométricas',
    btnAddNotebook: 'Guardar Problema',
    btnReset: 'Reiniciar',
    btnCopySolution: 'Copiar Solución',
    btnCopied: '¡Copiado!',
    btnExportSvg: 'Exportar Gráfico',

    langEn: 'English',
    langEs: 'Español',
    langFr: 'Français',
    langPt: 'Português',
    langZh: '中文',

    summaryCardTitle: 'Tarjeta de Posición Relativa y Distancia',
    summaryCardSub: 'Verificación instantánea de la distancia d al centro frente al radio R y longitud de cuerda',
    metricCenter: 'Centro O(x₀, y₀)',
    metricRadius: 'Radio R',
    metricDistance: 'Distancia al Centro d',
    metricChordOrExtrema: 'Longitud de Cuerda L',
    verdictLabel: 'Posición Relativa',
    verdictSecant: 'Secante (Intersección)',
    verdictTangent: 'Tangente',
    verdictDisjoint: 'Exterior (Disjunta)',
    verdictSecantDesc: 'Distancia d < R: La recta corta a la circunferencia en 2 puntos reales distintos.',
    verdictTangentDesc: 'Distancia d = R: La recta es tangente a la circunferencia en exactamente 1 punto de contacto.',
    verdictDisjointDesc: 'Distancia d > R: La recta es exterior a la circunferencia con 0 puntos de contacto.',
    fastAnswerLabel: 'Conclusión Clave de Examen',
    exactValueLabel: 'Forma Radical Exacta',

    circleInputHeader: 'Ecuación de la Circunferencia',
    circleGeneralTab: 'General: x² + y² + Dx + Ey + F = 0',
    circleStandardTab: 'Canónica: (x - x₀)² + (y - y₀)² = R²',
    lineInputHeader: 'Ecuación de la Recta',
    lineGeneralTab: 'General: Ax + By + C = 0',
    lineSlopeTab: 'Explícita: y = kx + b',
    linePointSlopeTab: 'Punto-Pendiente',
    currentEquation: 'Ecuación Actual de la Circunferencia:',
    currentLineEquation: 'Ecuación Actual de la Recta:',
    conditionCheck: 'Condición de Existencia: D² + E² - 4F =',
    validCircle: '✓ Circunferencia Real Válida',
    pointCircle: '⚠ Degenera en un punto único',
    imaginaryCircle: '✗ Circunferencia imaginaria (sin lugar geométrico real)',
    verticalLineCheck: 'Recta vertical (pendiente indefinida: x = c)',
    presetSectionTitle: 'Problemas Típicos de Exámenes y Selectividad:',
    quickParsePlaceholder: 'Pega la ecuación (ej: x^2+y^2-4x+2y-4=0 o 3x+4y=12 o y=2x-1)...',
    btnQuickParse: 'Auto Reconocer',
    quickParseSuccess: '¡Ecuaciones reconocidas y actualizadas con éxito!',
    quickParseError: 'No se pudo reconocer el formato. Revisa la sintaxis.',
    quickParseEmptyError: 'Por favor, introduce una ecuación (ej. x^2+y^2-2x+4y-4=0 o 3x+4y-12=0).',

    sliderTitle: 'Exploración Paramétrica Dinámica',
    sliderSub: 'Mueve el control deslizante para observar transiciones continuas entre Secante, Tangente y Exterior',
    sliderParamC: 'Término Independiente C',
    sliderParamK: 'Pendiente k',
    criticalValuesTitle: 'Valores Críticos de Tangencia (d = R)',

    canvasAuxToggle: 'Líneas Auxiliares',
    canvasExtremaToggle: 'Puntos Extremos',
    canvasResetView: 'Restablecer Vista',
    canvasZoomIn: 'Ampliar',
    canvasZoomOut: 'Reducir',
    canvasHint: 'Rueda del ratón para zoom · Arrastra para mover · Mueve el centro O para ver cambios en vivo',
    canvasScale: 'Escala: 1 cuadrícula =',
    pointCenterLabel: 'Centro',
    pointFootLabel: 'Pie H',
    pointTangentLabel: 'Punto de Tangencia T',
    chordLabel: 'Cuerda',
    nearPointLabel: 'Punto más cercano (d_mín)',
    farPointLabel: 'Punto más lejano (d_máx)',

    stepsHeader: 'Desarrollo Detallado Paso a Paso',
    stepsSub: 'Desglose completando el cuadrado · Fórmula de distancia · Teorema de la cuerda y método algebraico',
    tabAllSteps: 'Pasos Completos',
    tabSquareStep: 'Completar Cuadrados',
    tabDistanceStep: 'Distancia d a la Recta',
    tabChordStep: 'Teorema de la Cuerda',
    tabAlgebraicStep: 'Comparación con Vieta',

    step1Title: 'Paso 1: Agrupación de Variables y Trasposición de Constante',
    step1Desc: 'Agrupa los términos en x y en y entre paréntesis por separado y pasa la constante F al segundo miembro (-F).',
    step2Title: 'Paso 2: Completar el Cuadrado (Sumar la Mitad del Coeficiente al Cuadrado)',
    step2Desc: 'Aplicando (x + a)² = x² + 2ax + a², suma (D/2)² al grupo de x y (E/2)² al grupo de y en ambos miembros de la igualdad.',
    step3Title: 'Paso 3: Factorizar en la Ecuación Canónica',
    step3Desc: 'Factoriza cada binomio al cuadrado y simplifica el término numérico resultante a la derecha.',
    step4Title: 'Paso 4: Verificación del Discriminante y Extracción de Centro y Radio',
    step4Desc: 'Comprueba que D² + E² - 4F > 0 para confirmar que es una circunferencia real, y halla el centro O(-D/2, -E/2) y radio R.',
    step5Title: 'Paso 5: Cálculo con la Fórmula de Distancia Punto a Recta',
    step5Desc: 'Sustituye las coordenadas del centro en la ecuación general normalizada de la recta Ax + By + C = 0.',
    step6Title: 'Paso 6: Clasificación de la Posición Relativa',
    step6Desc: 'Compara directamente la distancia al centro d con el radio R para dictaminar la posición geométrica.',

    geometricMethodTitle: 'Método 1: Geométrico (Teorema de la Cuerda Perpendicular y Pitágoras)',
    geometricMethodBadge: 'Recomendado en Examen',
    geometricMethodDesc: 'En el triángulo rectángulo Rt△OHA formado por el centro O, el pie H y el extremo A, Pitágoras da: R² = d² + (L/2)². Por tanto la cuerda mide L = 2√(R² - d²).',
    algebraicMethodTitle: 'Método 2: Eliminación Algebraica y Fórmulas de Vieta',
    algebraicMethodBadge: 'Demostración Formal',
    algebraicMethodDesc: 'Despeja y sustituye la recta en la circunferencia para obtener una ecuación de segundo grado ax² + bx + c = 0. Con Δ > 0, calcula la cuerda L = √(1 + k²)|x₁ - x₂|.',
    dualMethodVerifyNotice: 'Verificación Doble: ¡Tanto el teorema geométrico de la cuerda como la eliminación algebraica dan exactamente el mismo resultado!',
    intersectionCoordsTitle: 'Coordenadas Exactas de Puntos de Intersección o Tangencia:',
    extremaDistancesTitle: 'Distancias Extremas desde Puntos de la Circunferencia a la Recta:',
    trianglePropertiesTitle: 'Propiedades Geométricas del Triángulo de la Cuerda:',
    noChordTriangle: 'La recta no corta la circunferencia; no se forma triángulo de cuerda.',
    areaTriangleOAB: 'Área de △OAB:',
    subtendedAngle: 'Ángulo subtendido θ:',
    footPerpendicularDesc: 'Pie de la perpendicular desde el centro a la recta (Punto medio de la cuerda M):',
    distanceFormulaExplanation: 'El numerador es el valor absoluto de la recta evaluada en el centro; el denominador es el módulo del vector normal.',

    toolboxTitle: 'Caja de Herramientas Geométricas Avanzadas',
    toolboxSub: 'Modelos esenciales para selectividad: Tangentes, Extremos punto-circunferencia, Relación entre dos circunferencias y Cuerda media',
    toolPointCircleTitle: 'Punto y Circunferencia (Posición y Extremos)',
    toolPointCircleDesc: 'Determina si un punto P(x, y) es interior, sobre o exterior a la circunferencia, y calcula distancias mínima y máxima.',
    toolTangentTitle: 'Resolución de Rectas Tangentes',
    toolTangentDesc: 'Obtén ecuaciones de tangentes desde un punto sobre o exterior a la circunferencia, longitud del segmento tangente y cuerda de contacto.',
    toolTwoCirclesTitle: 'Posición Relativa de Dos Circunferencias',
    toolTwoCirclesDesc: 'Clasifica las 5 posiciones relativas (exteriores, tangentes exteriores, secantes, tangentes interiores, interiores) y halla la recta del eje radical / cuerda común.',
    toolMidpointChordTitle: 'Cuerda con Punto Medio Conocido (Método de Diferencias)',
    toolMidpointChordDesc: 'Dado el punto medio M(x_m, y_m), deduce la ecuación de la cuerda mediante k_OM · k_AB = -1.',

    notebookTitle: 'Cuaderno de Problemas y Errores',
    notebookSub: 'Guarda problemas complejos, anota trampas habituales, busca por palabras clave y exporta hojas de estudio',
    notebookCountText: 'problemas guardados',
    btnSaveCurrent: 'Guardar Problema Actual',
    btnPrint: 'Imprimir Hoja',
    btnExportJson: 'Exportar Copia',
    btnImportJson: 'Importar Copia',
    searchPlaceholder: 'Buscar por título, palabras clave, etiquetas o fórmulas...',
    filterAll: 'Todos',
    filterUnmastered: 'Por Repasar',
    filterMastered: 'Dominados',
    filterAllTags: 'Todas las Etiquetas',
    noQuestionsFound: 'No se encontraron problemas que coincidan',
    noQuestionsSub: 'Prueba a cambiar los términos de búsqueda o guarda el problema actual.',
    noteLabel: 'Nota de Error y Aprendizaje:',
    noNoteText: 'Aún no hay notas. Pulsa el icono de editar para agregar tus reflexiones.',
    btnLoadIntoSolver: 'Cargar en el Resolutor',
    btnDelete: 'Eliminar',
    btnEditNote: 'Editar Nota',
    btnSaveNote: 'Guardar Nota',
    btnCancel: 'Cancelar',
    statusMastered: 'Dominado',
    statusUnmastered: 'Por Repasar',

    modalTitle: 'Guardar Problema en el Cuaderno',
    modalFieldTitle: 'Título del Problema / Convocatoria',
    modalFieldTitlePlaceholder: 'ej: Selectividad 2024 Geometría Analítica Ejercicio 3',
    modalFieldTag: 'Etiqueta Temática',
    modalFieldCustomTag: 'Etiqueta personalizada...',
    modalFieldNote: 'Errores Habituales y Apuntes (Opcional)',
    modalFieldNotePlaceholder: 'Escribe en qué te equivocaste, trucos para no caer en la trampa...',
    btnConfirmSave: 'Guardar Problema',

    glossaryTitle: 'Glosario de Conceptos y Palabras Clave',
    glossarySub: 'Teoremas y propiedades geométricas indispensables en bachillerato y universidad',
    keywordsTagSecant: 'Secante y Cuerda',
    keywordsTagTangent: 'Tangente y Contacto',
    keywordsTagDisjoint: 'Exterior y Extremos',
    keywordsTagSquare: 'Completar Cuadrados',
    keywordsTagChord: 'Cuerda Perpendicular',
    keywordsTagExtrema: 'Distancias Extremas',
    keywordsTagExam: 'Pregunta de Examen',
    keywordsTagVertical: 'Recta Vertical x=c',

    cheatTitle: 'Modelos Fundamentales de Geometría Analítica',
    cheatSub: 'Trucos de examen, fórmulas críticas y patrones de alta frecuencia',
    model1Title: 'Modelo 1: Teorema de la Cuerda Perpendicular (Triángulo Pitagórico)',
    model1Desc: 'La perpendicular desde el centro a una cuerda pasa por su punto medio. Radio R, distancia d y semicuerda L/2 forman un triángulo rectángulo: R² = d² + (L/2)², por lo que L = 2√(R² - d²).',
    model1Tip: 'Trampa Común: No confundas la semicuerda √(R² - d²) con la cuerda total L; multiplica siempre por 2. Si d = 0, la cuerda alcanza su valor máximo: el diámetro 2R.',
    model2Title: 'Modelo 2: Transformación de Ecuación General a Canónica',
    model2Desc: 'Cualquier ecuación x² + y² + Dx + Ey + F = 0 se transforma en (x + D/2)² + (y + E/2)² = (D² + E² - 4F)/4 completando cuadrados.',
    model2Tip: 'Condición Crítica: Requiere D² + E² - 4F > 0 para ser circunferencia real. Si es 0 es un punto; si es negativo no existe figura real.',
    model3Title: 'Modelo 3: Distancia Mínima y Máxima de la Circunferencia a la Recta',
    model3Desc: 'Trazando la perpendicular desde el centro a la recta se obtienen los dos puntos extremos: d_mín = |d - R|, d_máx = d + R.',
    model3Tip: 'Atajo: Si la recta corta a la circunferencia (d < R), la distancia mínima es 0, y la máxima sigue siendo d + R.',
    model4Title: 'Modelo 4: La Trampa de la Pendiente Indefinida (Recta Vertical x = c)',
    model4Desc: 'Al plantear rectas en forma explícita y = kx + b o punto-pendiente, comprueba siempre si la recta vertical x = c satisface el enunciado.',
    model4Tip: 'Mejor Práctica: Trabajar en forma general Ax + By + C = 0 engloba todas las orientaciones sin casos especiales.',

    footerDisclaimer: 'Diseño Blanco Limpio · Tipografía Matemática KaTeX de Alta Precisión · Almacenamiento Local Persistente',
  },

  fr: {
    appName: 'Analyseur Droite et Cercle',
    appShortName: 'Géométrie Analytique',
    tagline: 'Assistant de Géométrie Analytique : Complétion du Carré, Position Relative et Longueur de Corde',
    navSolver: 'Résolution Étape par Étape',
    navCanvas: 'Plan Interactif',
    navNotebook: 'Cahier d\'Exercices',
    navCheatsheet: 'Formules et Fiche Mémo',
    navToolbox: 'Boîte à Outils',
    btnAddNotebook: 'Sauvegarder l\'Exercice',
    btnReset: 'Réinitialiser',
    btnCopySolution: 'Copier la Solution',
    btnCopied: 'Copié !',
    btnExportSvg: 'Exporter le Schéma',

    langEn: 'English',
    langEs: 'Español',
    langFr: 'Français',
    langPt: 'Português',
    langZh: '中文',

    summaryCardTitle: 'Fiche Synthèse de Position et Distance',
    summaryCardSub: 'Vérification instantanée de la distance d au centre face au rayon R et longueur de corde',
    metricCenter: 'Centre O(x₀, y₀)',
    metricRadius: 'Rayon R',
    metricDistance: 'Distance au Centre d',
    metricChordOrExtrema: 'Longueur de Corde L',
    verdictLabel: 'Position Relative',
    verdictSecant: 'Sécante (2 Intersections)',
    verdictTangent: 'Tangente (1 Point)',
    verdictDisjoint: 'Extérieure (Disjointe)',
    verdictSecantDesc: 'Distance d < R : La droite coupe le cercle en 2 points réels distincts.',
    verdictTangentDesc: 'Distance d = R : La droite est tangente au cercle en 1 unique point de contact.',
    verdictDisjointDesc: 'Distance d > R : La droite est strictement extérieure au cercle (0 intersection).',
    fastAnswerLabel: 'Conclusion Clé d\'Examen',
    exactValueLabel: 'Forme Radicale Exacte',

    circleInputHeader: 'Équation du Cercle',
    circleGeneralTab: 'Générale : x² + y² + Dx + Ey + F = 0',
    circleStandardTab: 'Cartésienne : (x - x₀)² + (y - y₀)² = R²',
    lineInputHeader: 'Équation de la Droite',
    lineGeneralTab: 'Générale : Ax + By + C = 0',
    lineSlopeTab: 'Réduite : y = kx + b',
    linePointSlopeTab: 'Point-Pente',
    currentEquation: 'Équation Actuelle du Cercle :',
    currentLineEquation: 'Équation Actuelle de la Droite :',
    conditionCheck: 'Condition d\'Existence : D² + E² - 4F =',
    validCircle: '✓ Cercle Réel Valide',
    pointCircle: '⚠ Dégénère en un point unique',
    imaginaryCircle: '✗ Cercle imaginaire (aucun lieu réel)',
    verticalLineCheck: 'Droite verticale (pente non définie : x = c)',
    presetSectionTitle: 'Exercices Classiques du Baccalauréat et Concours :',
    quickParsePlaceholder: 'Collez l\'équation (ex: x^2+y^2-4x+2y-4=0 ou 3x+4y=12 ou y=2x-1)...',
    btnQuickParse: 'Reconnaissance Auto',
    quickParseSuccess: 'Équations reconnues et synchronisées avec succès !',
    quickParseError: 'Format non reconnu. Veuillez vérifier la syntaxe.',
    quickParseEmptyError: 'Veuillez entrer une équation (ex. x^2+y^2-2x+4y-4=0 ou 3x+4y-12=0).',

    sliderTitle: 'Exploration Paramétrique Dynamique',
    sliderSub: 'Déplacez le curseur pour observer les transitions directes entre Sécante, Tangente et Extérieure',
    sliderParamC: 'Terme Constant C',
    sliderParamK: 'Coefficient Directeur k',
    criticalValuesTitle: 'Valeurs Critiques de Tangence (d = R)',

    canvasAuxToggle: 'Lignes Auxiliaires',
    canvasExtremaToggle: 'Points Extrêmes',
    canvasResetView: 'Recentrer la Vue',
    canvasZoomIn: 'Zoomer',
    canvasZoomOut: 'Dézoomer',
    canvasHint: 'Molette pour zoomer · Glisser pour déplacer · Déplacer le centre O pour tester en direct',
    canvasScale: 'Échelle : 1 carreau =',
    pointCenterLabel: 'Centre',
    pointFootLabel: 'Pied H',
    pointTangentLabel: 'Point de Tangence T',
    chordLabel: 'Corde',
    nearPointLabel: 'Point le plus proche (d_min)',
    farPointLabel: 'Point le plus éloigné (d_max)',

    stepsHeader: 'Résolution Détaillée Pas à Pas',
    stepsSub: 'Méthode de complétion du carré · Formule de distance · Théorème de la corde et méthode algébrique',
    tabAllSteps: 'Toutes les Étapes',
    tabSquareStep: 'Complétion du Carré',
    tabDistanceStep: 'Distance d à la Droite',
    tabChordStep: 'Théorème de la Corde',
    tabAlgebraicStep: 'Relations de Viète',

    step1Title: 'Étape 1 : Regroupement des Variables et Déplacement de la Constante',
    step1Desc: 'Isolez les termes en x et les termes en y entre parenthèses et passez la constante F à droite (-F).',
    step2Title: 'Étape 2 : Complétion du Carré (Ajout de la Moitié du Coefficient au Carré)',
    step2Desc: 'À l\'aide de (x + a)² = x² + 2ax + a², ajoutez (D/2)² à x et (E/2)² à y des deux côtés de l\'égalité.',
    step3Title: 'Étape 3 : Factorisation sous Forme Cartésienne',
    step3Desc: 'Factorisez sous forme de carrés parfaits et réduisez la somme constante à droite.',
    step4Title: 'Étape 4 : Vérification du Discriminant et Détermination du Centre et Rayon',
    step4Desc: 'Vérifiez que D² + E² - 4F > 0 pour confirmer un cercle réel, puis identifiez le centre O(-D/2, -E/2) et le rayon R.',
    step5Title: 'Étape 5 : Calcul par la Formule de Distance Point-Droite',
    step5Desc: 'Injectez les coordonnées du centre dans l\'équation générale normalisée de la droite Ax + By + C = 0.',
    step6Title: 'Étape 6 : Synthèse de la Position Géométrique',
    step6Desc: 'Comparez la distance d au rayon R pour déduire la position relative du cercle et de la droite.',

    geometricMethodTitle: 'Méthode 1 : Géométrique (Théorème de la Corde et Pythagore)',
    geometricMethodBadge: 'Privilégiée au Bac',
    geometricMethodDesc: 'Dans le triangle rectangle Rt△OHA formé par le centre O, le pied H et l\'extrémité A, Pythagore donne : R² = d² + (L/2)². D\'où la corde L = 2√(R² - d²).',
    algebraicMethodTitle: 'Méthode 2 : Élimination Algébrique et Relations de Viète',
    algebraicMethodBadge: 'Démonstration Rigoureuse',
    algebraicMethodDesc: 'Exprimez y et substituez dans l\'équation du cercle pour former un trinôme ax² + bx + c = 0. Avec Δ > 0, calculez la corde L = √(1 + k²)|x₁ - x₂|.',
    dualMethodVerifyNotice: 'Double Vérification : Le théorème géométrique et la méthode algébrique aboutissent à la même longueur de corde !',
    intersectionCoordsTitle: 'Coordonnées Exactes des Points d\'Intersection ou de Contact :',
    extremaDistancesTitle: 'Distances Extrêmes entre les Points du Cercle et la Droite :',
    trianglePropertiesTitle: 'Propriétés Géométriques du Triangle de la Corde :',
    noChordTriangle: 'La droite ne coupe pas le cercle ; aucun triangle de corde n\'est formé.',
    areaTriangleOAB: 'Aire de △OAB :',
    subtendedAngle: 'Angle sous-tendu θ :',
    footPerpendicularDesc: 'Pied de la perpendiculaire menée du centre sur la droite (Milieu de la corde M) :',
    distanceFormulaExplanation: 'Le numérateur est la valeur absolue de l\'équation de la droite évaluée au centre ; le dénominateur est la norme du vecteur normal.',

    toolboxTitle: 'Boîte à Outils de Géométrie Analytique',
    toolboxSub: 'Modèles incontournables des épreuves : Tangentes, Extrêmes point-cercle, Deux cercles et Corde moyenne',
    toolPointCircleTitle: 'Point et Cercle (Position et Extrêmes)',
    toolPointCircleDesc: 'Déterminez si un point P(x, y) est intérieur, sur ou extérieur au cercle, et calculez les distances min/max.',
    toolTangentTitle: 'Équations des Droites Tangentes',
    toolTangentDesc: 'Trouvez les tangentes depuis un point sur ou hors du cercle, la longueur de tangente et la corde de contact.',
    toolTwoCirclesTitle: 'Position Relative de Deux Cercles',
    toolTwoCirclesDesc: 'Analysez les 5 positions relatives (extérieurs, tangents extérieurs, sécants, tangents intérieurs, intérieurs) et l\'axe radical / corde commune.',
    toolMidpointChordTitle: 'Corde de Milieu Donné (Méthode des Différences)',
    toolMidpointChordDesc: 'Connaissant le milieu M(x_m, y_m), déterminez l\'équation de la corde via k_OM · k_AB = -1.',

    notebookTitle: 'Cahier d\'Erreurs et d\'Exercices',
    notebookSub: 'Enregistrez les exercices difficiles, annotez vos pièges, recherchez par mots-clés et imprimez des fiches',
    notebookCountText: 'exercices enregistrés',
    btnSaveCurrent: 'Enregistrer l\'Exercice',
    btnPrint: 'Imprimer la Fiche',
    btnExportJson: 'Exporter la Sauvegarde',
    btnImportJson: 'Importer la Sauvegarde',
    searchPlaceholder: 'Rechercher par titre, mots-clés, étiquettes ou équations...',
    filterAll: 'Tous',
    filterUnmastered: 'À Revoir',
    filterMastered: 'Maîtrisés',
    filterAllTags: 'Toutes les Étiquettes',
    noQuestionsFound: 'Aucun exercice correspondant',
    noQuestionsSub: 'Modifiez vos critères de recherche ou enregistrez l\'exercice courant.',
    noteLabel: 'Note d\'Erreur et Point Clé :',
    noNoteText: 'Aucune note pour le moment. Cliquez sur le crayon pour ajouter vos réflexions.',
    btnLoadIntoSolver: 'Charger dans le Résolveur',
    btnDelete: 'Supprimer',
    btnEditNote: 'Modifier la Note',
    btnSaveNote: 'Enregistrer la Note',
    btnCancel: 'Annuler',
    statusMastered: 'Maîtrisé',
    statusUnmastered: 'À Revoir',

    modalTitle: 'Enregistrer dans le Cahier d\'Exercices',
    modalFieldTitle: 'Titre de l\'Exercice / Source d\'Examen',
    modalFieldTitlePlaceholder: 'ex: Baccalauréat Spécialité Maths Géométrie Exercice 2',
    modalFieldTag: 'Étiquette Thématique',
    modalFieldCustomTag: 'Étiquette personnalisée...',
    modalFieldNote: 'Erreurs Fréquentes et Mémo (Optionnel)',
    modalFieldNotePlaceholder: 'Notez le piège dans lequel vous êtes tombé, les conditions limites...',
    btnConfirmSave: 'Enregistrer l\'Exercice',

    glossaryTitle: 'Glossaire des Notions Clés et Mots-Clés',
    glossarySub: 'Théorèmes fondamentaux de géométrie analytique au lycée et classes préparatoires',
    keywordsTagSecant: 'Sécante et Corde',
    keywordsTagTangent: 'Tangente et Contact',
    keywordsTagDisjoint: 'Extérieure et Extrema',
    keywordsTagSquare: 'Complétion du Carré',
    keywordsTagChord: 'Corde Perpendiculaire',
    keywordsTagExtrema: 'Distances Extrêmes',
    keywordsTagExam: 'Exercice d\'Examen',
    keywordsTagVertical: 'Droite Verticale x=c',

    cheatTitle: 'Fiche Mémo : Modèles Incontournables de Géométrie Analytique',
    cheatSub: 'Raccourcis de calcul, formules indispensables et configurations fréquentes',
    model1Title: 'Modèle 1 : Théorème de la Corde (Triangle Rectangle Pythagoricien)',
    model1Desc: 'La perpendiculaire menée du centre à une corde coupe celle-ci en son milieu. Le rayon R, la distance d et la demi-corde L/2 forment un triangle rectangle : R² = d² + (L/2)², soit L = 2√(R² - d²).',
    model1Tip: 'Piège Fréquent : Ne confondez pas la demi-corde √(R² - d²) avec la corde L ; multipliez toujours par 2. Lorsque d = 0, la corde est maximale et égale au diamètre 2R.',
    model2Title: 'Modèle 2 : Passage de l\'Équation Générale à la Forme Cartésienne',
    model2Desc: 'Toute équation x² + y² + Dx + Ey + F = 0 se réécrit (x + D/2)² + (y + E/2)² = (D² + E² - 4F)/4 par complétion du carré.',
    model2Tip: 'Condition Essentielle : Exige D² + E² - 4F > 0 pour un cercle réel. Si nul, c\'est un point ; si négatif, aucune solution réelle.',
    model3Title: 'Modèle 3 : Distances Minimale et Maximale d\'un Point du Cercle à la Droite',
    model3Desc: 'La droite perpendiculaire passant par le centre détermine les deux points extrêmes : d_min = |d - R|, d_max = d + R.',
    model3Tip: 'Astuce : Si la droite est sécante (d < R), la distance minimale est 0 et la maximale est d + R.',
    model4Title: 'Modèle 4 : Le Piège de la Droite Verticale (Pente Non Définie x = c)',
    model4Desc: 'En posant une droite y = kx + b ou y - y₀ = k(x - x₀), pensez toujours à tester séparément la droite verticale x = c.',
    model4Tip: 'Bonne Pratique : Travailler avec la forme générale Ax + By + C = 0 évite tout oubli de cas particulier.',

    footerDisclaimer: 'Interface Blanche Épurée · Typographie Mathématique KaTeX Haute Définition · Stockage Local Persistant',
  },

  pt: {
    appName: 'Analisador Reta e Circunferência',
    appShortName: 'Geometria Analítica',
    tagline: 'Assistente de Geometria Analítica: Completamento de Quadrados, Posição Relativa e Comprimento da Corda',
    navSolver: 'Resolução Passo a Passo',
    navCanvas: 'Plano Interativo',
    navNotebook: 'Caderno de Exercícios',
    navCheatsheet: 'Fórmulas e Resumo',
    navToolbox: 'Ferramentas Geométricas',
    btnAddNotebook: 'Salvar Exercício',
    btnReset: 'Redefinir',
    btnCopySolution: 'Copiar Solução',
    btnCopied: 'Copiado!',
    btnExportSvg: 'Exportar Gráfico',

    langEn: 'English',
    langEs: 'Español',
    langFr: 'Français',
    langPt: 'Português',
    langZh: '中文',

    summaryCardTitle: 'Cartão de Posição Relativa e Distância',
    summaryCardSub: 'Verificação instantânea da distância d ao centro em relação ao raio R e comprimento da corda',
    metricCenter: 'Centro O(x₀, y₀)',
    metricRadius: 'Raio R',
    metricDistance: 'Distância ao Centro d',
    metricChordOrExtrema: 'Comprimento da Corda L',
    verdictLabel: 'Posição Relativa',
    verdictSecant: 'Secante (2 Interseções)',
    verdictTangent: 'Tangente (1 Ponto)',
    verdictDisjoint: 'Exterior (Disjunta)',
    verdictSecantDesc: 'Distância d < R: A reta intercepta a circunferência em 2 pontos reais distintos.',
    verdictTangentDesc: 'Distância d = R: A reta é tangente à circunferência em exatamente 1 ponto de contato.',
    verdictDisjointDesc: 'Distância d > R: A reta é exterior à circunferência (0 interseções).',
    fastAnswerLabel: 'Conclusão Rápida para Provas',
    exactValueLabel: 'Forma Radical Exata',

    circleInputHeader: 'Equação da Circunferência',
    circleGeneralTab: 'Geral: x² + y² + Dx + Ey + F = 0',
    circleStandardTab: 'Reduzida: (x - x₀)² + (y - y₀)² = R²',
    lineInputHeader: 'Equação da Reta',
    lineGeneralTab: 'Geral: Ax + By + C = 0',
    lineSlopeTab: 'Reduzida: y = kx + b',
    linePointSlopeTab: 'Ponto-Inclinação',
    currentEquation: 'Equação Atual da Circunferência:',
    currentLineEquation: 'Equação Atual da Reta:',
    conditionCheck: 'Condição de Existência: D² + E² - 4F =',
    validCircle: '✓ Circunferência Real Válida',
    pointCircle: '⚠ Degenera em um único ponto',
    imaginaryCircle: '✗ Circunferência imaginária (sem lugar geométrico real)',
    verticalLineCheck: 'Reta vertical (coeficiente angular indefinido: x = c)',
    presetSectionTitle: 'Questões Clássicas do ENEM e Vestibulares:',
    quickParsePlaceholder: 'Cole a equação (ex: x^2+y^2-4x+2y-4=0 ou 3x+4y=12 ou y=2x-1)...',
    btnQuickParse: 'Reconhecer Auto',
    quickParseSuccess: 'Equações reconhecidas e sincronizadas com sucesso!',
    quickParseError: 'Formato não reconhecido. Verifique a sintaxe.',
    quickParseEmptyError: 'Por favor, insira uma equação (ex. x^2+y^2-2x+4y-4=0 ou 3x+4y-12=0).',

    sliderTitle: 'Exploração Paramétrica Dinâmica',
    sliderSub: 'Mova o controle deslizante para observar a transição entre Secante, Tangente e Exterior',
    sliderParamC: 'Termo Independente C',
    sliderParamK: 'Coeficiente Angular k',
    criticalValuesTitle: 'Valores Críticos de Tangência (d = R)',

    canvasAuxToggle: 'Linhas Auxiliares',
    canvasExtremaToggle: 'Pontos Extremos',
    canvasResetView: 'Recentralizar Vista',
    canvasZoomIn: 'Ampliar',
    canvasZoomOut: 'Reduzir',
    canvasHint: 'Roda do mouse para zoom · Arraste para mover · Mova o centro O para testar ao vivo',
    canvasScale: 'Escala: 1 quadrícula =',
    pointCenterLabel: 'Centro',
    pointFootLabel: 'Pé H',
    pointTangentLabel: 'Ponto de Tangência T',
    chordLabel: 'Corda',
    nearPointLabel: 'Ponto mais próximo (d_mín)',
    farPointLabel: 'Ponto mais distante (d_máx)',

    stepsHeader: 'Resolução Detalhada Passo a Passo',
    stepsSub: 'Completamento de quadrados · Fórmula de distância ponto-reta · Teorema da corda e método algébrico',
    tabAllSteps: 'Passos Completos',
    tabSquareStep: 'Completar Quadrados',
    tabDistanceStep: 'Distância d à Reta',
    tabChordStep: 'Teorema da Corda',
    tabAlgebraicStep: 'Relações de Viète',

    step1Title: 'Passo 1: Agrupamento de Variáveis e Transposição da Constante',
    step1Desc: 'Isole os termos em x e os termos em y entre parênteses e passe a constante F para o segundo membro (-F).',
    step2Title: 'Passo 2: Completamento de Quadrados (Somar a Metade do Coeficiente ao Quadrado)',
    step2Desc: 'Usando (x + a)² = x² + 2ax + a², some (D/2)² a x e (E/2)² a y em ambos os lados da equação.',
    step3Title: 'Passo 3: Fatoração na Forma Reduzida',
    step3Desc: 'Fatore cada binômio ao quadrado e simplifique a soma constante no lado direito.',
    step4Title: 'Passo 4: Verificação do Discriminante e Extração do Centro e Raio',
    step4Desc: 'Verifique se D² + E² - 4F > 0 para confirmar que é uma circunferência real, identificando o centro O(-D/2, -E/2) e o raio R.',
    step5Title: 'Passo 5: Cálculo da Distância de Ponto a Reta',
    step5Desc: 'Substitua as coordenadas do centro na equação geral normalizada da reta Ax + By + C = 0.',
    step6Title: 'Passo 6: Conclusão da Posição Geométrica',
    step6Desc: 'Compare a distância d com o raio R para determinar a posição relativa entre a reta e a circunferência.',

    geometricMethodTitle: 'Método 1: Geométrico (Teorema da Corda Perpendicular e Pitágoras)',
    geometricMethodBadge: 'Mais Rápido em Provas',
    geometricMethodDesc: 'No triângulo retângulo Rt△OHA formado pelo centro O, o pé H e a extremidade A, Pitágoras dá: R² = d² + (L/2)². Logo a corda mede L = 2√(R² - d²).',
    algebraicMethodTitle: 'Método 2: Eliminação Algébrica e Relações de Viète',
    algebraicMethodBadge: 'Resolução Dissertativa',
    algebraicMethodDesc: 'Isole y e substitua na circunferência para obter a equação do segundo grau ax² + bx + c = 0. Com Δ > 0, calcule a corda L = √(1 + k²)|x₁ - x₂|.',
    dualMethodVerifyNotice: 'Dupla Confirmação: O método geométrico e o método algébrico produzem exatamente o mesmo comprimento de corda!',
    intersectionCoordsTitle: 'Coordenadas Exatas dos Pontos de Interseção ou Tangência:',
    extremaDistancesTitle: 'Distâncias Extremas de Pontos da Circunferência até a Reta:',
    trianglePropertiesTitle: 'Propriedades Geométricas do Triângulo da Corda:',
    noChordTriangle: 'A reta não intersecta a circunferência; nenhum triângulo de corda é formado.',
    areaTriangleOAB: 'Área de △OAB:',
    subtendedAngle: 'Ângulo subtendido θ:',
    footPerpendicularDesc: 'Pé da perpendicular traçada do centro sobre a reta (Ponto médio da corda M):',
    distanceFormulaExplanation: 'O numerador é o valor absoluto da reta avaliada no centro; o denominador é a norma do vetor normal.',

    toolboxTitle: 'Caixa de Ferramentas Geométricas Avançadas',
    toolboxSub: 'Modelos essenciais para ENEM e vestibulares: Tangentes, Extremos ponto-círculo, Posição entre duas circunferências e Ponto médio de corda',
    toolPointCircleTitle: 'Ponto e Circunferência (Posição e Extremos)',
    toolPointCircleDesc: 'Determine se um ponto P(x, y) é interno, pertencente ou externo à circunferência, e calcule distâncias mín/máx.',
    toolTangentTitle: 'Equações de Retas Tangentes',
    toolTangentDesc: 'Obtenha equações de tangentes traçadas por um ponto na circunferência ou externo, comprimento do segmento tangente e corda de contato.',
    toolTwoCirclesTitle: 'Posição Relativa de Duas Circunferências',
    toolTwoCirclesDesc: 'Analise as 5 posições relativas (exteriores, tangentes exteriores, secantes, tangentes interiores, interiores) e a equação da corda comum / eixo radical.',
    toolMidpointChordTitle: 'Corda com Ponto Médio Conhecido (Método das Diferenças)',
    toolMidpointChordDesc: 'Dado o ponto médio M(x_m, y_m), determine a reta suporte da corda através de k_OM · k_AB = -1.',

    notebookTitle: 'Caderno de Erros e Questões',
    notebookSub: 'Salve questões complexas, anote pegadinhas de vestibular, pesquise palavras-chave e imprima folhas de treino',
    notebookCountText: 'questões salvas',
    btnSaveCurrent: 'Salvar Exercício Atual',
    btnPrint: 'Imprimir Folha',
    btnExportJson: 'Exportar Cópia',
    btnImportJson: 'Importar Cópia',
    searchPlaceholder: 'Pesquisar por título, palavras-chave, etiquetas ou equações...',
    filterAll: 'Todas',
    filterUnmastered: 'Para Revisar',
    filterMastered: 'Dominadas',
    filterAllTags: 'Todas as Etiquetas',
    noQuestionsFound: 'Nenhuma questão encontrada',
    noQuestionsSub: 'Ajuste os termos de busca ou salve a questão atual do resolutor.',
    noteLabel: 'Anotação de Erro e Dica Chave:',
    noNoteText: 'Nenhuma nota ainda. Clique no ícone de lápis para registrar sua reflexão.',
    btnLoadIntoSolver: 'Carregar no Resolutor',
    btnDelete: 'Excluir',
    btnEditNote: 'Editar Nota',
    btnSaveNote: 'Salvar Nota',
    btnCancel: 'Cancelar',
    statusMastered: 'Dominado',
    statusUnmastered: 'Para Revisar',

    modalTitle: 'Salvar Questão no Caderno',
    modalFieldTitle: 'Título da Questão / Prova de Origem',
    modalFieldTitlePlaceholder: 'ex: ENEM 2024 Geometria Analítica Questão 165',
    modalFieldTag: 'Etiqueta Temática',
    modalFieldCustomTag: 'Etiqueta personalizada...',
    modalFieldNote: 'Erros Comuns e Observações (Opcional)',
    modalFieldNotePlaceholder: 'Escreva onde teve dúvida, condições de contorno para prestar atenção...',
    btnConfirmSave: 'Salvar Questão',

    glossaryTitle: 'Glossário de Conceitos e Palavras-Chave',
    glossarySub: 'Teoremas fundamentais de geometria analítica cobrados no ensino médio e vestibulares',
    keywordsTagSecant: 'Secante e Corda',
    keywordsTagTangent: 'Tangente e Contato',
    keywordsTagDisjoint: 'Exterior e Extremos',
    keywordsTagSquare: 'Completar Quadrados',
    keywordsTagChord: 'Corda Perpendicular',
    keywordsTagExtrema: 'Distâncias Extremas',
    keywordsTagExam: 'Questão de Prova',
    keywordsTagVertical: 'Reta Vertical x=c',

    cheatTitle: 'Modelos Fundamentais de Geometria Analítica',
    cheatSub: 'Macestres de prova, fórmulas críticas e configurações recorrentes',
    model1Title: 'Modelo 1: Teorema da Corda Perpendicular (Triângulo Pitagórico)',
    model1Desc: 'A perpendicular traçada do centro até uma corda divide-a ao meio. O raio R, a distância d e a semicorda L/2 formam um triângulo retângulo: R² = d² + (L/2)², logo L = 2√(R² - d²).',
    model1Tip: 'Pegadinha Comum: Não confunda a semicorda √(R² - d²) com a corda total L; multiplique sempre por 2. Quando d = 0, a corda atinge seu valor máximo: o diâmetro 2R.',
    model2Title: 'Modelo 2: Conversão da Equação Geral para a Reduzida',
    model2Desc: 'Toda equação x² + y² + Dx + Ey + F = 0 converte-se em (x + D/2)² + (y + E/2)² = (D² + E² - 4F)/4 pelo completamento de quadrados.',
    model2Tip: 'Condição Crítica: Exige D² + E² - 4F > 0 para representar circunferência real. Se for 0, é um ponto; se for negativo, não há lugar geométrico real.',
    model3Title: 'Modelo 3: Distâncias Mínima e Máxima da Circunferência à Reta',
    model3Desc: 'A reta perpendicular traçada do centro define os dois pontos de distância extrema: d_mín = |d - R|, d_máx = d + R.',
    model3Tip: 'Atalho: Se a reta for secante (d < R), a distância mínima é 0 e a máxima é d + R.',
    model4Title: 'Modelo 4: A Armadilha da Reta Vertical (Coeficiente Angular Inexistente x = c)',
    model4Desc: 'Ao equacionar retas na forma reduzida y = kx + b ou ponto-inclinação, teste sempre se a reta vertical x = c satisfaz o enunciado.',
    model4Tip: 'Boa Prática: A equação geral Ax + By + C = 0 contempla todas as orientações e dispensa divisão em casos.',

    footerDisclaimer: 'Visual Branco Limpo · Tipografia Matemática KaTeX de Alta Precisão · Armazenamento Local Persistente',
  },

  zh: {
    appName: '直线与圆位置关系判定器',
    appShortName: '高考解析几何助手',
    tagline: '高中几何压轴填空解题助手：配方法拆解过程、相交/相切/相离秒判、垂径定理与弦长双向推演',
    navSolver: '求解分析与步骤',
    navCanvas: '几何交互画板',
    navNotebook: '错题与压轴本',
    navCheatsheet: '考点与秒杀公式',
    navToolbox: '高中压轴工具箱',
    btnAddNotebook: '加入错题本',
    btnReset: '重置',
    btnCopySolution: '复制解答',
    btnCopied: '已复制步骤！',
    btnExportSvg: '导出几何图',

    langEn: 'English',
    langEs: 'Español',
    langFr: 'Français',
    langPt: 'Português',
    langZh: '中文',

    summaryCardTitle: '圆心距与半径快速判定卡',
    summaryCardSub: '高考填空压轴秒杀验证：圆心距 d 与半径 R 大小对比及截得割线弦长',
    metricCenter: '圆心坐标 O(x₀, y₀)',
    metricRadius: '圆半径 R',
    metricDistance: '圆心到直线距离 d',
    metricChordOrExtrema: '截得弦长 L',
    verdictLabel: '位置关系',
    verdictSecant: '相交 (割线)',
    verdictTangent: '相切 (切线)',
    verdictDisjoint: '相离 (外离)',
    verdictSecantDesc: '圆心距 d < R：直线与圆有两个不同的公共交点，截得割线弦。',
    verdictTangentDesc: '圆心距 d = R：直线与圆有且仅有一个切点，直线为圆的切线。',
    verdictDisjointDesc: '圆心距 d > R：直线与圆没有公共交点，直线位于圆的外部。',
    fastAnswerLabel: '压轴填空极速结论',
    exactValueLabel: '精确根式结果',

    circleInputHeader: '圆的方程输入',
    circleGeneralTab: '一般式：x² + y² + Dx + Ey + F = 0',
    circleStandardTab: '标准式：(x - x₀)² + (y - y₀)² = R²',
    lineInputHeader: '直线的方程输入',
    lineGeneralTab: '一般式：Ax + By + C = 0',
    lineSlopeTab: '斜截式：y = kx + b',
    linePointSlopeTab: '点斜式',
    currentEquation: '当前圆方程：',
    currentLineEquation: '当前直线方程：',
    conditionCheck: '充要条件检验：D² + E² - 4F =',
    validCircle: '✓ 构成有效实圆',
    pointCircle: '⚠ 退化为单点',
    imaginaryCircle: '✗ 虚圆 (无实数轨迹)',
    verticalLineCheck: '特殊情况：斜率不存在（垂直直线 x = c）',
    presetSectionTitle: '高考真题与经典题型快载：',
    quickParsePlaceholder: '直接粘贴方程 (如 x^2+y^2-4x+2y-4=0 或 3x+4y=12 或 y=2x-1)...',
    btnQuickParse: '智能识别',
    quickParseSuccess: '已成功智能识别并更新方程参数！',
    quickParseError: '无法识别方程格式，请检查输入符号。',
    quickParseEmptyError: '请输入方程（例如 x^2+y^2-2x+4y-4=0 或 3x+4y-12=0）。',

    sliderTitle: '含参动态探索器',
    sliderSub: '拖动参数滑块，实时观察相交、相切临界值及相离的连续演变过程',
    sliderParamC: '常数截距 C',
    sliderParamK: '斜率 k',
    criticalValuesTitle: '相切临界值验证 (d = R)',

    canvasAuxToggle: '辅助线',
    canvasExtremaToggle: '最值点',
    canvasResetView: '重置视图',
    canvasZoomIn: '放大',
    canvasZoomOut: '缩小',
    canvasHint: '滚轮缩放 / 拖拽移动画布 · 拖动圆心 O 可动态观察判定与弦长',
    canvasScale: '比例尺：1格 =',
    pointCenterLabel: '圆心',
    pointFootLabel: '垂足 H',
    pointTangentLabel: '切点 T',
    chordLabel: '弦',
    nearPointLabel: '最近点 (d_min)',
    farPointLabel: '最远点 (d_max)',

    stepsHeader: '详细解题步骤与推演',
    stepsSub: '配方法拆解过程 · 点到直线距离公式 · 垂径定理与代数韦达双解法对比',
    tabAllSteps: '完整步骤',
    tabSquareStep: '配方法拆解',
    tabDistanceStep: '点到线距离 d',
    tabChordStep: '垂径弦长定理',
    tabAlgebraicStep: '代数消元法对比',

    step1Title: '第 1 步：圆的一般方程常数项移项与变量分组',
    step1Desc: '将含有 x 的项、含有 y 的项分别归拢加括号，并将常数项 F 移至等号右侧（变号为 -F）。',
    step2Title: '第 2 步：配完全平方式（两边同时加上一次项系数一半的平方）',
    step2Desc: '根据完全平方公式 (x+a)² = x² + 2ax + a²：x 分组加上 (D/2)²，y 分组加上 (E/2)²，等式右侧同步增加以保持等式成立。',
    step3Title: '第 3 步：整理得圆的标准方程',
    step3Desc: '将两组完全平方式分别写成 (x - x₀)² + (y - y₀)² 形式，右侧计算求和得到半径平方 R²。',
    step4Title: '第 4 步：判别式检验与确定圆心及半径',
    step4Desc: '检验判别式 D² + E² - 4F > 0，确认方程表示真正的实圆，提取圆心坐标 O(-D/2, -E/2) 与半径 R。',
    step5Title: '第 5 步：点到直线距离公式代入推导（计算圆心距 d）',
    step5Desc: '将圆心坐标代入规范化直线一般式 Ax + By + C = 0，分子取绝对值，分母计算法向量模长。',
    step6Title: '第 6 步：圆心距与半径快速验证对比（判定法则）',
    step6Desc: '通过比对圆心距 d 与半径 R 的大小关系，判定相交、相切或相离。',

    geometricMethodTitle: '解法一：几何法（垂径定理 + 勾股模型·考场首选）',
    geometricMethodBadge: '推荐秒杀',
    geometricMethodDesc: '在由圆心 O、弦中点（垂足）H、弦端点 A 构成的直角三角形 Rt△OHA 中，勾股定理：R² = d² + (L/2)²。由此求得截得割线弦长 L = 2√(R² - d²)。',
    algebraicMethodTitle: '解法二：代数法（联立消元 + 韦达定理·大题必考）',
    algebraicMethodBadge: '规范答题',
    algebraicMethodDesc: '将直线方程代入圆方程消元得到关于 x 的一元二次方程 ax² + bx + c = 0。利用判别式 Δ > 0 与两根之和/积，根据弦长公式 L = √(1+k²)|x₁ - x₂| 计算。',
    dualMethodVerifyNotice: '双向验算印证：几何垂径法与代数消元法求得的弦长数值完全一致，考场互验 100% 杜绝失误！',
    intersectionCoordsTitle: '交点与切点精确坐标：',
    extremaDistancesTitle: '圆上动点到直线的最值距离：',
    trianglePropertiesTitle: '弦三角形几何特征：',
    noChordTriangle: '直线与圆不相交，无法构成弦三角形。',
    areaTriangleOAB: '△OAB 面积：',
    subtendedAngle: '弦所对圆心角 θ：',
    footPerpendicularDesc: '圆心向直线所作垂足坐标（即弦中点 M）：',
    distanceFormulaExplanation: '分子为圆心坐标代入直线方程的绝对值，分母为法向量模长。',

    toolboxTitle: '高中几何压轴工具箱',
    toolboxSub: '高考必考四大模型：圆的切线与切点弦方程、点与圆位置及距离最值、两圆五大位置关系与公共弦方程、弦中点与点差法',
    toolPointCircleTitle: '点与圆位置关系及最值',
    toolPointCircleDesc: '秒判点 P(x, y) 在圆内/圆上/圆外，一键计算点到圆的最短距离、最大距离以及切线长。',
    toolTangentTitle: '求圆的切线与切点弦方程',
    toolTangentDesc: '支持过圆上一点求切线、过圆外一点求两条切线方程、切点坐标、切线长及切点弦方程。',
    toolTwoCirclesTitle: '两圆位置关系与公共弦方程',
    toolTwoCirclesDesc: '对比圆心距与两圆半径之和/差判定外离、外切、相交、内切、内含，两圆相交时秒求公共弦直线方程及公共弦长。',
    toolMidpointChordTitle: '点差法与已知弦中点求直线',
    toolMidpointChordDesc: '已知弦中点 M(x_m, y_m)，运用点差法推导 k_OM · k_AB = -1，快速求出弦所在直线方程与斜率。',

    notebookTitle: '高中解析几何 · 错题与压轴本',
    notebookSub: '支持一键归档、易错考点反思、关键词高亮检索、纸质试卷打印与备份',
    notebookCountText: '道题目已归档',
    btnSaveCurrent: '保存当前题',
    btnPrint: '打印试卷',
    btnExportJson: '导出备份',
    btnImportJson: '导入备份',
    searchPlaceholder: '搜索题目标题、考点标签、易错反思或方程公式...',
    filterAll: '全部',
    filterUnmastered: '未攻克',
    filterMastered: '已掌握',
    filterAllTags: '所有标签',
    noQuestionsFound: '暂未检索到符合条件的错题',
    noQuestionsSub: '可点击右上角「保存当前题」或更改搜索关键词及分类标签。',
    noteLabel: '易错反思与核心警示：',
    noNoteText: '暂无详细备忘，点击右侧铅笔即可添加。',
    btnLoadIntoSolver: '载入判定器',
    btnDelete: '删除',
    btnEditNote: '编辑心得',
    btnSaveNote: '保存心得',
    btnCancel: '取消',
    statusMastered: '已熟练掌握',
    statusUnmastered: '需重点二刷',

    modalTitle: '保存至错题与压轴本',
    modalFieldTitle: '题目标题 / 考卷出处',
    modalFieldTitlePlaceholder: '例如：2024八省联考几何压轴填空第15题',
    modalFieldTag: '知识点分类标签',
    modalFieldCustomTag: '自定义标签...',
    modalFieldNote: '易错点归纳 / 心得备忘（可选）',
    modalFieldNotePlaceholder: '记录你在做这道题时的卡壳点、审题漏洞或解题技巧...',
    btnConfirmSave: '保存题目',

    glossaryTitle: '高考几何高频核心概念与关键词索引',
    glossarySub: '解析几何高频考点、易错陷阱与几何模型速查',
    keywordsTagSecant: '相交与弦长',
    keywordsTagTangent: '相切与切线',
    keywordsTagDisjoint: '相离与最值',
    keywordsTagSquare: '配方法化简',
    keywordsTagChord: '垂径定理',
    keywordsTagExtrema: '最值距离',
    keywordsTagExam: '高考真题',
    keywordsTagVertical: '竖直线防坑',

    cheatTitle: '高中解析几何 · 直线与圆高频必考核心模型',
    cheatSub: '高考填空压轴秒杀模型、严谨分类防坑指南与双解法汇总',
    model1Title: '模型一：垂径定理与弦长勾股模型（秒杀首选）',
    model1Desc: '在圆中，过圆心作弦的垂线，垂足平分弦。半弦长、圆心距 d、半径 R 恒构成直角三角形：R² = d² + (L/2)²，得到 L = 2√(R² - d²)。',
    model1Tip: '易错警示：考场极易将半弦长 √(R²-d²) 当成弦长，务必记得乘以 2。当 d=0 时截得弦长最长，等于直径 2R。',
    model2Title: '模型二：圆的一般方程配方法标准转化',
    model2Desc: '圆的一般方程 x² + y² + Dx + Ey + F = 0 通过配方化为标准方程 (x + D/2)² + (y + E/2)² = (D² + E² - 4F)/4。',
    model2Tip: '充要条件：D² + E² - 4F > 0 表示圆；等于 0 为点；小于 0 无实图形。圆心为 (-D/2, -E/2)，半径 R = √(D²+E²-4F)/2。',
    model3Title: '模型三：圆上任意一点到直线距离的最值',
    model3Desc: '设圆心到直线的距离为 d，半径为 R。过圆心作垂线，两交点为极值点：相离时 d_min = d - R，d_max = d + R；相交时 d_min = 0。',
    model3Tip: '解题策略：圆上点到直线的距离问题，转化为圆心到直线的距离 d 再加减半径 R，切勿设参数求导繁化。',
    model4Title: '模型四：斜率不存在特殊直线的严谨分类',
    model4Desc: '在设直线方程为 y = kx + b 或点斜式时，务必先验证斜率不存在的特殊直线 x = c 是否满足题意。',
    model4Tip: '防坑指南：优先使用一般式 Ax + By + C = 0 或者设 x = my + n，可从源头避免分类讨论遗漏。',

    footerDisclaimer: '纯白背景纸感设计 · LaTeX 数学公式渲染 · 本地错题本持久化存储',
  },
};
