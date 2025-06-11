import {Pipe} from "@angular/core";

@Pipe(
    {
        name: 'shortNaissance',
        standalone: true
    }
)
export class ShortNaissancePipe {
    transform(value: string): string {
        if (!value) return '';
        // Extraire uniquement les 4 premiers caractères (année)
        const yearPart = value.substring(0, 4);
        // Vérifier que nous avons bien une année valide
        if (!/^\d{4}$/.test(yearPart)) return value; // Retourne valeur originale si format incorrect
        return yearPart;
    }
}