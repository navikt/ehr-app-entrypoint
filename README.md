# ehr-app-entrypoint
SMART on FHIR lar oss integrere mot EPJ-systemer. For å sørge for 
en sammenhengede brukeropplevelse på tvers av autonome teams 
applikasjoner bør vi ha ett felles punkt der epjene treffer oss.




### ./metadata

https://docs.aidbox.app/tutorials/smart-of-fhir#metadata

Her mangler det noe fra serveren.

Må dette endepunktet settes manuelt?

```
"rest": [{
    "security": {
        "extension": [{
            "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
                "extension": [
                {
                    "url": "token",
                    "valueUri": "[base-url]/auth/token"
                },
                {
                    "url": "authorize",
                    "valueUri": "[base-url]/auth/authorize"
                }
            ]
        }
   ]
```
