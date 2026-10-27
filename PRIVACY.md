# Privacy design — prototype

The initial web app accepts only text selected and authorized by the user. The API processes this information in memory to return a demonstration result; the application code does not write a conversation database or intentionally log request bodies.

Important: the user's browser and any hosting provider can still handle network metadata; this is NOT a formal privacy policy for production. Do not submit sensitive real-world content until hosting, processor terms, retention and consent language are reviewed.

No Meta model call, external identity lookup, analytics tracker or third-party verifier is implemented at this stage. Browser input is not used to train a model in the offline demonstrator.

Future data features require explicit legal basis, consent where applicable, encryption, retention limits, deletion process, processor contracts, access audits and abuse prevention. For current concerns, use the repo owner's private contact route if established.
