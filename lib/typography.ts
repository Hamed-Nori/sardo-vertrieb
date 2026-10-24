// Typografische Feinheiten, die der Prototyp im HTML setzt (&nbsp; / &shy;),
// content.de.json aber nicht enthält. Der Wortlaut bleibt unverändert.
const NBSP = " ";
const SHY = "­";

export function typo(text: string): string {
  return text
    .replace(/(\d) ([€%])/g, `$1${NBSP}$2`)
    .replace("TU Darmstadt", `TU${NBSP}Darmstadt`)
    .replace("Daniele Sardo.", `Daniele${NBSP}Sardo.`)
    .replace("Dienstleistungsbetriebe", `Dienstleistungs${SHY}betriebe`);
}
