import json
import itertools
import os

# Charger le fichier JSON
file_path = r'C:\Users\minog\Documents\Cours\MDS\crazydev\doc\local.metier.json'  # Utiliser raw string
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Générer toutes les combinaisons possibles de (securite, confort, creativite) de 1 à 5
combinations = list(itertools.product(range(1, 6), repeat=3))

# Dictionnaire pour suivre les indices des combinaisons
combination_index = 0

for item in data:
    # Vérifier si nous avons encore des combinaisons disponibles
    if combination_index < len(combinations):
        # Assigner la combinaison actuelle
        item['securite'], item['confort'], item['creativite'] = combinations[combination_index]
        combination_index += 1
    else:
        # Si toutes les combinaisons sont utilisées, on peut choisir de ne rien faire ou de réinitialiser
        print("Plus de combinaisons disponibles.")
        break

# Écrire les nouvelles données dans le fichier JSON
with open(file_path, 'w', encoding='utf-8') as outfile:
    json.dump(data, outfile, ensure_ascii=False, indent=4)

print("Le fichier local.metier.json a été mis à jour avec les nouvelles combinaisons.")
