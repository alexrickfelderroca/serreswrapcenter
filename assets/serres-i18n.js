/* =====================================================================
   SERRES — site-wide language switcher (EN / ES / CA)
   ---------------------------------------------------------------------
   • The static HTML ships in SPANISH (SEO base language). This script
     reversibly translates static DOM text nodes + a few attributes
     against a curated EN→{es,ca} dictionary, matched in reverse via an
     inverted ES→EN index (INV). Anything not in the dictionary is left
     untouched (graceful — car names, 3M film names, codes, place
     names, PPF/SiO₂/3M, units, etc. stay as-is).
   • Elements with data-en="English key" render tr(key) as their text —
     used for fragments whose Spanish rendition is empty ("").
   • Injects a segmented EN/ES/CA switcher into the desktop nav and the
     mobile overlay menu, styled to match the chrome / dark aesthetic.
   • Persists the choice in localStorage and re-applies on every page.
   • Data-driven sections (price tiers, testimonials, finish filters)
     manage their own copy and just listen for `serres:langchange`.
   Auto-loaded by assets/serres-enhance.js on every page.
   ===================================================================== */
(function () {
  "use strict";

  var STORE = "serres-lang";
  var LANGS = ["en", "es", "ca"];
  var LABELS = { en: "EN", es: "ES", ca: "CA" };

  /* ===================================================================
     DICTIONARY  —  "English source" : ["español", "català"]
     A value of "" means: render nothing in that language (used for
     inline-split headings whose words reflow into other fragments).
     =================================================================== */
  var DICT = {
    /* ---------- NAV / shared actions ---------- */
    "Services": ["Servicios", "Serveis"],
    "Gallery": ["Galería", "Galeria"],
    "Projects": ["Proyectos", "Projectes"],
    "Prices": ["Precios", "Preus"],
    "Why SERRES": ["Por qué SERRES", "Per què SERRES"],
    "Contact": ["Contacto", "Contacte"],
    "Get a Quote": ["Pedir presupuesto", "Demana pressupost"],
    "Explore Services": ["Ver servicios", "Explora els serveis"],
    "Back to site": ["Volver al sitio", "Torna al lloc"],
    "All services": ["Todos los servicios", "Tots els serveis"],
    "Call the Studio": ["Llamar al taller", "Truca al taller"],
    "Talk to the Studio": ["Hablar con el taller", "Parla amb el taller"],
    "See the Gallery": ["Ver la galería", "Mira la galeria"],
    "See the Work": ["Ver el trabajo", "Mira la feina"],
    "See Projects": ["Ver proyectos", "Mira els projectes"],
    "Request Your Build": ["Solicita tu proyecto", "Sol·licita el teu projecte"],
    "What's Included": ["Qué incluye", "Què inclou"],
    "About the Exclusive": ["Sobre el Exclusivo", "Sobre l'Exclusiu"],
    "Scroll": ["Desliza", "Desplaça"],
    "Chat on WhatsApp": ["Escríbenos por WhatsApp", "Escriu-nos per WhatsApp"],
    "Open menu": ["Abrir menú", "Obre el menú"],
    "Close menu": ["Cerrar menú", "Tanca el menú"],

    /* ---------- HOME ---------- */
    "SERRES — Premium Paint Protection, Wraps & Detailing":
      ["SERRES — PPF, Car Wrap y Detailing Premium en Barcelona", "SERRES — PPF, Car Wrap i Detailing Premium a Barcelona"],
    "Premium Detailing & Customization":
      ["Detailing y personalización premium", "Detailing i personalització premium"],
    "Elevate": ["Eleva", "Eleva"],
    "your dream": ["tu sueño", "el teu somni"],
    "Paint protection, custom wraps, and concours-level detailing — engineered for the cars you build your life around. One workshop. Obsessive standards.":
      ["Protección de pintura, Car Wrap a medida y detailing de nivel concours, pensados para los coches alrededor de los que construyes tu vida. Un taller. Estándares obsesivos.",
       "Protecció de pintura, Car Wrap a mida i detailing de nivell concours, pensats per als cotxes al voltant dels quals construeixes la teva vida. Un taller. Estàndards obsessius."],
    "The SERRES Build": ["La transformación SERRES", "La transformació SERRES"],
    "Our services": ["Nuestros servicios", "Els nostres serveis"],
    "Choose where to begin.": ["Elige por dónde empezar.", "Tria per on començar."],
    "Six specialities, one standard. Tap a service to see the process, materials and pricing.":
      ["Seis especialidades, un mismo estándar. Toca un servicio para ver el proceso, los materiales y los precios.",
       "Sis especialitats, un mateix estàndard. Toca un servei per veure el procés, els materials i els preus."],
    "Invisible protection": ["Protección invisible", "Protecció invisible"],
    "Colour change": ["Cambio de color", "Canvi de color"],
    "Seal & gloss": ["Sellado y brillo", "Segellat i brillantor"],
    "Inside & outside": ["Interior y exterior", "Interior i exterior"],
    "Aero & stance": ["Aero y stance", "Aero i stance"],
    "We make your": ["Hacemos realidad tu", "Fem realitat el teu"],
    "dream car": ["coche soñado", "cotxe somiat"],
    "a reality": ["", ""],
    "CAR WRAP": ["CAR WRAP", "CAR WRAP"],
    "Ceramic": ["Cerámica", "Ceràmica"],
    "Paint Correction": ["Corrección de pintura", "Correcció de pintura"],
    "Body Kits": ["Body Kits", "Body Kits"],
    "Scroll to transform": ["Desliza para transformar", "Desplaça per transformar"],
    "Book your build": ["Reserva tu proyecto", "Reserva el teu projecte"],
    "Bring us the car.": ["Tráenos el coche.", "Porta'ns el cotxe."],
    "We'll redefine it.": ["Lo redefiniremos.", "El redefinirem."],
    "Studio": ["Taller", "Taller"],
    "Hours": ["Horario", "Horari"],
    "Phone": ["Teléfono", "Telèfon"],
    "Mon–Sat · By appointment": ["Lun–Sáb · Con cita previa", "Dl–Ds · Amb cita prèvia"],
    "Follow & chat": ["Síguenos y escríbenos", "Segueix-nos i escriu-nos"],
    "Premium paint protection, custom wraps, and concours-level detailing.":
      ["Protección de pintura, Car Wrap a medida y detailing de nivel concours.",
       "Protecció de pintura, Car Wrap a mida i detailing de nivell concours."],
    "Paint Protection Film": ["Paint Protection Film", "Paint Protection Film"],
    "Barcelona, Spain": ["Barcelona, España", "Barcelona, Espanya"],
    "Follow": ["Síguenos", "Segueix-nos"],
    "© 2026 SERRES. All rights reserved.":
      ["© 2026 SERRES. Todos los derechos reservados.", "© 2026 SERRES. Tots els drets reservats."],
    "PPF · Car Wrap · Detailing · Paint Correction · Body Kits":
      ["PPF · Car Wrap · Detailing · Corrección de pintura · Body Kits",
       "PPF · Car Wrap · Detailing · Correcció de pintura · Body Kits"],
    "Call SERRES": ["Llamar a SERRES", "Truca a SERRES"],

    /* ---------- GALLERY ---------- */
    "SERRES — Gallery": ["Proyectos — SERRES Barcelona", "Projectes — SERRES Barcelona"],
    "Our": ["Nuestros", "Els nostres"],
    "The Showroom": ["El showroom", "El showroom"],
    "The": ["La", "La"],
    "Every car gets its own room. Shot in and around Barcelona — no stock photos, no rented cars. Pick a build below, or scroll the floor.":
      ["Cada coche tiene su propia sala. Fotografiado en Barcelona y alrededores — sin fotos de stock ni coches de alquiler. Elige un proyecto abajo o recorre la planta.",
       "Cada cotxe té la seva pròpia sala. Fotografiat a Barcelona i rodalies — sense fotos d'estoc ni cotxes de lloguer. Tria un projecte a sota o recorre la planta."],
    "RAUH-Welt Begriff": ["RAUH-Welt Begriff", "RAUH-Welt Begriff"],
    "A widebody RAUH-Welt 993 — riveted arches, race wing and a mirror-silver finish.":
      ["Un RAUH-Welt 993 widebody — pasos de rueda remachados, alerón de competición y un acabado plata espejo.",
       "Un RAUH-Welt 993 widebody — passos de roda reblats, aleró de competició i un acabat plata mirall."],
    "Detailing": ["Detailing", "Detailing"],
    "Frames": ["Tomas", "Preses"],
    "G87 · Frozen Grey Wrap": ["G87 · Car Wrap gris frozen", "G87 · Car Wrap gris frozen"],
    "A new G87 M2 wrapped in a deep frozen grey, photographed on a Barcelona rooftop with the Collserola tower behind it. Matte body, gloss-black detailing, carbon accents.":
      ["Un M2 G87 nuevo con Car Wrap en un gris frozen profundo, fotografiado en una azotea de Barcelona con la torre de Collserola detrás. Carrocería mate, detalles en negro brillo, acentos de carbono.",
       "Un M2 G87 nou amb Car Wrap en un gris frozen profund, fotografiat en un terrat de Barcelona amb la torre de Collserola al darrere. Carrosseria mat, detalls en negre brillant, accents de carboni."],
    "A90 · Pearl White": ["A90 · Blanco perla", "A90 · Blanc perla"],
    "A pearl-white GR Supra protected and sealed, then taken out into the Catalan countryside.":
      ["Un GR Supra blanco perla protegido y sellado, llevado después al campo catalán.",
       "Un GR Supra blanc perla protegit i segellat, portat després al camp català."],
    "E92 · Gloss Black": ["E92 · Negro brillo", "E92 · Negre brillant"],
    "A lowered E92 335i in deep gloss black — caught rolling at speed on the motorway and parked up on a cypress-lined coast road. Paint correction and a slick protective finish.":
      ["Un E92 335i rebajado en negro brillo profundo — captado rodando a velocidad en la autopista y aparcado en una carretera de costa bordeada de cipreses. Corrección de pintura y un acabado protector deslizante.",
       "Un E92 335i abaixat en negre brillant profund — captat rodant a velocitat a l'autopista i aparcat en una carretera de costa vorejada de xiprers. Correcció de pintura i un acabat protector lliscant."],
    "G09 · Matte Black": ["G09 · Negro mate", "G09 · Negre mat"],
    "A matte-black XM wrapped in full PPF and finished inside and out — illuminated kidney grille, Alcantara starlight headliner and quad exhaust, shot on a sun-broken Catalan back road.":
      ["Un XM negro mate cubierto con PPF completo y rematado por dentro y por fuera — parrilla iluminada, cielo estrellado de Alcantara y escape cuádruple, fotografiado en una carretera secundaria catalana con el sol entre las nubes.",
       "Un XM negre mat cobert amb PPF complet i rematat per dins i per fora — graella il·luminada, cel estrellat d'Alcantara i escapament quàdruple, fotografiat en una carretera secundària catalana amb el sol entre els núvols."],
    "Your car next": ["El próximo, tu coche", "El proper, el teu cotxe"],
    "Earn your": ["Gánate tu", "Guanya't la teva"],
    "own room.": ["propia sala.", "pròpia sala."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Shot on real client cars":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Sobre coches reales de clientes",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Sobre cotxes reals de clients"],
    /* gallery shot captions (visible on hover + in lightbox) */
    "In the studio": ["En el estudio", "A l'estudi"],
    "Mirror finish": ["Acabado espejo", "Acabat mirall"],
    "Doors open": ["Puertas abiertas", "Portes obertes"],
    "Widebody profile": ["Perfil widebody", "Perfil widebody"],
    "Detail bay": ["Box de detailing", "Box de detailing"],
    "Snow-dusted": ["Con nieve", "Amb neu"],
    "Winter": ["Invierno", "Hivern"],
    "Rooftop": ["Azotea", "Terrat"],
    "Collserola": ["Collserola", "Collserola"],
    "Rear detail": ["Detalle trasero", "Detall posterior"],
    "Wrap": ["Wrap", "Wrap"],
    "Masia driveway": ["Entrada de la masía", "Entrada de la masia"],
    "Mountain road": ["Carretera de montaña", "Carretera de muntanya"],
    "Gloss": ["Brillo", "Brillant"],
    "Dappled light": ["Luz tamizada", "Llum tamisada"],
    "Rolling shot": ["Toma rodando", "Presa rodant"],
    "On the road": ["En la carretera", "A la carretera"],
    "Coast road": ["Carretera de costa", "Carretera de costa"],
    "Gloss black": ["Negro brillo", "Negre brillant"],
    "Back road": ["Carretera secundaria", "Carretera secundària"],
    "Lit grille": ["Parrilla iluminada", "Graella il·luminada"],
    "Detail": ["Detalle", "Detall"],
    "Quad exhaust": ["Escape cuádruple", "Escapament quàdruple"],
    "Starlight headliner": ["Cielo estrellado", "Cel estrellat"],
    "Interior": ["Interior", "Interior"],
    "Cockpit": ["Habitáculo", "Habitacle"],
    /* gallery lightbox data-note strings */
    "Front three-quarter · In the studio": ["Tres cuartos delantero · En el estudio", "Tres quarts davanter · A l'estudi"],
    "From above · Mirror finish": ["Desde arriba · Acabado espejo", "Des de dalt · Acabat mirall"],
    "Doors open · Front": ["Puertas abiertas · Frontal", "Portes obertes · Frontal"],
    "Side profile · Detail bay": ["Perfil lateral · Box de detailing", "Perfil lateral · Box de detailing"],
    "Snow-dusted · The ramp": ["Con nieve · La rampa", "Amb neu · La rampa"],
    "Frozen grey · Rooftop": ["Gris frozen · Azotea", "Gris frozen · Terrat"],
    "Front end · Collserola": ["Frontal · Collserola", "Frontal · Collserola"],
    "Rear deck detail": ["Detalle trasero", "Detall posterior"],
    "Pearl white · Masia driveway": ["Blanco perla · Entrada de la masía", "Blanc perla · Entrada de la masia"],
    "Rear quarter · Mountain road": ["Cuarto trasero · Carretera de montaña", "Quart posterior · Carretera de muntanya"],
    "Rear three-quarter · Dappled light": ["Tres cuartos trasero · Luz tamizada", "Tres quarts posterior · Llum tamisada"],
    "Gloss black · Rolling shot": ["Negro brillo · Toma rodando", "Negre brillant · Presa rodant"],
    "Gloss black · Coast road": ["Negro brillo · Carretera de costa", "Negre brillant · Carretera de costa"],
    "Front three-quarter · Back road": ["Tres cuartos delantero · Carretera secundaria", "Tres quarts davanter · Carretera secundària"],
    "Illuminated kidney grille": ["Parrilla iluminada", "Graella il·luminada"],
    "Rear · Quad exhaust": ["Trasera · Escape cuádruple", "Posterior · Escapament quàdruple"],
    "Alcantara starlight headliner": ["Cielo estrellado de Alcantara", "Cel estrellat d'Alcantara"],
    "Cockpit · M steering wheel": ["Habitáculo · Volante M", "Habitacle · Volant M"],
    "Jump to a car": ["Ir a un coche", "Ves a un cotxe"],
    "Ligier · Matte Black Car Wrap": ["Ligier · Car Wrap negro mate", "Ligier · Car Wrap negre mat"],
    "A Ligier microcar transformed with a matte black Car Wrap — red grille accents, black wheels with red details and smoked lights. The same standard of finish, in a small footprint.":
      ["Un microcoche Ligier transformado con Car Wrap negro mate — acentos rojos en la parrilla, llantas en negro con detalles rojos y ópticas ahumadas. El mismo estándar de acabado, en formato pequeño.",
       "Un microcotxe Ligier transformat amb Car Wrap negre mat — accents vermells a la graella, llandes en negre amb detalls vermells i òptiques fumades. El mateix estàndard d'acabat, en format petit."],
    "Matte Black": ["Negro mate", "Negre mat"],
    "Hex lighting": ["Luz hexagonal", "Llum hexagonal"],
    "Rear three-quarter · In the studio": ["Tres cuartos trasero · En el estudio", "Tres quarts posterior · A l'estudi"],
    "Front three-quarter · Hex lighting": ["Tres cuartos delantero · Luz hexagonal", "Tres quarts davanter · Llum hexagonal"],
    "F40 · Satin Grey Car Wrap": ["F40 · Car Wrap gris satinado", "F40 · Car Wrap gris setinat"],
    "1 Series": ["Serie 1", "Sèrie 1"],
    "A 1 Series taken from its factory colour to a satin grey Car Wrap — gloss black grille and contrasting roof, shot under the studio hex lights.":
      ["Un Serie 1 llevado del color de fábrica a un Car Wrap gris satinado — parrilla en negro brillo y techo en contraste, fotografiado bajo las luces hexagonales del estudio.",
       "Un Sèrie 1 portat del color de fàbrica a un Car Wrap gris setinat — graella en negre brillant i sostre en contrast, fotografiat sota les llums hexagonals de l'estudi."],

    /* ---------- PRICES (static chrome only; tiers handled in-page) ---------- */
    "SERRES — Prices": ["Precios — PPF, Car Wrap, Ceramic Coating y Detailing | SERRES", "Preus — PPF, Car Wrap, Ceramic Coating i Detailing | SERRES"],
    "Transparent Pricing": ["Precios transparentes", "Preus transparents"],
    "Pick your": ["Elige tu", "Tria el teu"],
    "level.": ["nivel.", "nivell."],
    "Three levels for every service — from a clean essential package to a no-compromise concours finish. Guide prices below; every car is confirmed with an exact quote in person.":
      ["Tres niveles para cada servicio — desde un paquete esencial impecable hasta un acabado concours sin concesiones. Precios orientativos abajo; cada coche se confirma con un presupuesto exacto en persona.",
       "Tres nivells per a cada servei — des d'un paquet essencial impecable fins a un acabat concours sense concessions. Preus orientatius a sota; cada cotxe es confirma amb un pressupost exacte en persona."],
    "Guide prices · final quote depends on vehicle size, condition & film choice · no maintenance kit included":
      ["Precios orientativos · el presupuesto final depende del tamaño del vehículo, su estado y la elección de film · no incluyen kit de mantenimiento",
       "Preus orientatius · el pressupost final depèn de la mida del vehicle, el seu estat i l'elecció de film · no inclouen kit de manteniment"],
    "Compare": ["Compara", "Compara"],
    "levels": ["niveles", "nivells"],
    "Want everything?": ["¿Lo quieres todo?", "Ho vols tot?"],
    "The full build is a": ["El proyecto completo es un", "El projecte complet és un"],
    "Exclusive.": ["Exclusivo.", "Exclusiu."],
    "PPF, wrap, correction, ceramic, interior and body work — one car, one vision, priced as a single project. We take on a limited number each year.":
      ["PPF, Car Wrap, corrección, Ceramic Coating, interior y carrocería — un coche, una visión, presupuestado como un único proyecto. Aceptamos un número limitado cada año.",
       "PPF, Car Wrap, correcció, Ceramic Coating, interior i carrosseria — un cotxe, una visió, pressupostat com un únic projecte. N'acceptem un nombre limitat cada any."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Guide prices in EUR, VAT included":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Precios orientativos en EUR, IVA incluido",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Preus orientatius en EUR, IVA inclòs"],

    /* ---------- PROJECTS / EXCLUSIVO ---------- */
    "SERRES — Exclusive": ["Exclusivo SERRES — Transformación Completa", "Exclusiu SERRES — Transformació Completa"],
    "Exclusive": ["Exclusivo", "Exclusiu"],
    "One car.": ["Un coche.", "Un cotxe."],
    "Everything.": ["Todo.", "Tot."],
    "Builds a year": ["Exclusivos al año", "Exclusius l'any"],
    "Car at a time": ["Coche a la vez", "Cotxe alhora"],
    "Bespoke": ["A medida", "A mida"],
    "For owners who don't want a service — they want the car reimagined. Correction, protection, colour, interior, body work: every discipline we have, applied to one car as a single project.":
      ["Para propietarios que no quieren un servicio — quieren reimaginar el coche. Corrección, protección, color, interior, carrocería: cada disciplina que tenemos, aplicada a un coche como un único proyecto.",
       "Per a propietaris que no volen un servei — volen reimaginar el cotxe. Correcció, protecció, color, interior, carrosseria: cada disciplina que tenim, aplicada a un cotxe com un únic projecte."],
    "The Scope": ["El alcance", "L'abast"],
    "Every discipline.": ["Cada disciplina.", "Cada disciplina."],
    "One vision.": ["Una visión.", "Una visió."],
    "An Exclusive isn't a bundle of services — it's one design, executed across every surface of the car.":
      ["Un Exclusivo no es un paquete de servicios — es un único diseño, ejecutado en cada superficie del coche.",
       "Un Exclusiu no és un paquet de serveis — és un únic disseny, executat a cada superfície del cotxe."],
    "The foundation. Multi-stage machine polishing until the paint reads flawless under hex lighting.":
      ["La base. Pulido a máquina multietapa hasta que la pintura se ve impecable bajo la luz hexagonal.",
       "La base. Polit a màquina multietapa fins que la pintura es veu impecable sota la llum hexagonal."],
    "The identity. A full colour change or signature film chosen in a one-to-one design consultation.":
      ["La identidad. Un cambio de color completo o un film signature elegido en una consulta de diseño personalizada.",
       "La identitat. Un canvi de color complet o un film signature triat en una consulta de disseny personalitzada."],
    "The insurance. Self-healing film over the finished surfaces, edges tucked, invisible.":
      ["El seguro. Film autorreparable sobre las superficies acabadas, bordes ocultos, invisible.",
       "L'assegurança. Film autoreparable sobre les superfícies acabades, vores amagades, invisible."],
    "Ceramic Coating": ["Ceramic Coating", "Ceramic Coating"],
    "The seal. Multi-layer SiO₂ over paint, film and glass for years of slick protection.":
      ["El sellado. SiO₂ multicapa sobre pintura, film y cristales para años de protección deslizante.",
       "El segellat. SiO₂ multicapa sobre pintura, film i vidres per a anys de protecció lliscant."],
    "Body & Stance": ["Carrocería y stance", "Carrosseria i stance"],
    "The silhouette. Aero, arches, wheels and fitment resolved as part of the same design.":
      ["La silueta. Aero, pasos de rueda, llantas y encaje resueltos como parte del mismo diseño.",
       "La silueta. Aero, passos de roda, llandes i encaix resolts com a part del mateix disseny."],
    "Interior Revival": ["Renovación de interior", "Renovació d'interior"],
    "The cockpit. Steam-cleaned, conditioned and protected until it matches the outside.":
      ["El habitáculo. Limpiado a vapor, acondicionado y protegido hasta igualar el exterior.",
       "L'habitacle. Netejat a vapor, condicionat i protegit fins a igualar l'exterior."],
    "Explore": ["Ver más", "Mira-ho"],
    "How it works": ["Cómo funciona", "Com funciona"],
    "Three steps to": ["Tres pasos hacia", "Tres passos cap a"],
    "a different car.": ["un coche distinto.", "un cotxe diferent."],
    "The Consultation": ["La consulta", "La consulta"],
    "Bring the car, or just the idea. We talk colours, films, stance and budget — and tell you honestly what's worth doing on your car.":
      ["Trae el coche, o solo la idea. Hablamos de colores, films, stance y presupuesto — y te decimos con honestidad qué merece la pena hacer en tu coche.",
       "Porta el cotxe, o només la idea. Parlem de colors, films, stance i pressupost — i et diem amb honestedat què val la pena fer al teu cotxe."],
    "The Blueprint": ["El plano", "El plànol"],
    "You receive a single document: the full design, the exact scope, the timeline and a fixed price estimation. No surprises later.":
      ["Recibes un único documento: el diseño completo, el alcance exacto, los plazos y una estimación de precio cerrada. Sin sorpresas después.",
       "Reps un únic document: el disseny complet, l'abast exacte, els terminis i una estimació de preu tancada. Sense sorpreses després."],
    "The Build": ["El proyecto", "El projecte"],
    "Your car gets the studio to itself. One team, start to finish — with photo updates at every milestone until handover day.":
      ["Tu coche tiene el taller para él solo. Un equipo, de principio a fin — con fotos en cada hito hasta el día de la entrega.",
       "El teu cotxe té el taller per a ell sol. Un equip, de principi a fi — amb fotos a cada fita fins al dia del lliurament."],
    "Limited by design": ["Limitado por diseño", "Limitat per disseny"],
    "Six Exclusives.": ["Seis Exclusivos.", "Sis Exclusius."],
    "Per year. That's it.": ["Al año. Nada más.", "L'any. Res més."],
    "A full build takes over the studio for weeks, so we only accept a handful each year. Tell us about your car — if the vision fits, we'll reserve your slot and prepare your estimation.":
      ["Un proyecto completo ocupa el taller durante semanas, así que solo aceptamos unos pocos al año. Cuéntanos tu coche — si la visión encaja, reservamos tu plaza y preparamos tu estimación.",
       "Un projecte complet ocupa el taller durant setmanes, així que només n'acceptem uns quants l'any. Explica'ns el teu cotxe — si la visió encaixa, reservem la teva plaça i preparem la teva estimació."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Exclusivo — limited full builds":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Exclusivo — proyectos completos limitados",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Exclusiu — projectes complets limitats"],

    /* ---------- WHY SERRES (static; testimonials in-page) ---------- */
    "SERRES — Why SERRES": ["Por Qué SERRES — Estudio Premium en Sant Cugat", "Per Què SERRES — Estudi Premium a Sant Cugat"],
    "Why": ["Por qué", "Per què"],
    "Cars Transformed": ["Coches transformados", "Cotxes transformats"],
    "Average Rating": ["Valoración media", "Valoració mitjana"],
    "Workshop": ["Taller", "Taller"],
    "One studio in Sant Cugat with one obsession: doing it properly. No shortcuts, no \u201Cgood enough\u201D — meticulous prep, premium materials and the same standards applied to a daily driver and a hypercar alike.":
      ["Somos un taller en Sant Cugat con una obsesión: hacerlo bien. Sin atajos, sin \u201Cya vale\u201D — solo preparación meticulosa, materiales premium y los mismos estándares aplicados a un coche diario y a un hiperdeportivo por igual.",
       "Som un taller a Sant Cugat amb una obsessió: fer-ho bé. Sense dreceres, sense \u201Cja n'hi ha prou\u201D — només preparació meticulosa, materials premium i els mateixos estàndards aplicats a un cotxe diari i a un hiperesportiu per igual."],
    "The Difference": ["La diferencia", "La diferència"],
    "Standards you": ["Estándares que", "Estàndards que"],
    "can measure.": ["puedes medir.", "pots mesurar."],
    "Four principles that decide whether a car leaves the studio — or stays until it's right.":
      ["Cuatro principios que deciden si un coche sale del taller — o se queda hasta que está perfecto.",
       "Quatre principis que decideixen si un cotxe surt del taller — o es queda fins que està perfecte."],
    "Obsessive": ["Preparación", "Preparació"],
    "prep": ["obsesiva", "obsessiva"],
    "Most of the work happens before the result shows. Decontamination, measurement and correction come first — every time.":
      ["La mayor parte del trabajo ocurre antes de que se vea el resultado. Descontaminación, inspección y corrección van primero — siempre.",
       "La major part de la feina passa abans que es vegi el resultat. Descontaminació, inspecció i correcció van primer — sempre."],
    "Results": ["Resultados", "Resultats"],
    "on display": ["a la vista", "a la vista"],
    "Controlled hex lighting and panel-by-panel inspection. We show you the finish under the light, not just in photos.":
      ["Iluminación hexagonal controlada y revisión panel a panel. Te enseñamos el acabado bajo la luz, no solo en fotos.",
       "Il·luminació hexagonal controlada i revisió panell a panell. T'ensenyem l'acabat sota la llum, no només en fotos."],
    "Premium": ["Materiales", "Materials"],
    "materials": ["premium", "premium"],
    "Only certified films, coatings and compounds — backed by real manufacturer warranties, never grey-market stock.":
      ["Solo films, recubrimientos y compuestos certificados — respaldados por garantías reales de fabricante, nunca stock de mercado gris.",
       "Només films, recobriments i compostos certificats — avalats per garanties reals de fabricant, mai estoc de mercat gris."],
    "One": ["Un solo", "Un sol"],
    "workshop": ["taller", "taller"],
    "One point of contact from start to finish: the same team that quotes your car is the team that hands it back.":
      ["Un único interlocutor de principio a fin: el mismo equipo que presupuesta tu coche es el que te lo entrega.",
       "Un únic interlocutor de principi a fi: el mateix equip que pressuposta el teu cotxe és el que te l'entrega."],
    "What clients say": ["Lo que dicen los clientes", "El que diuen els clients"],
    "Trusted with": ["La confianza de", "La confiança de"],
    "the cars they": ["los coches que", "els cotxes que"],
    "love most.": ["más quieren.", "més estimen."],
    "From a first wrap to a full PPF and correction build — these are the people who handed us the keys, and what they said when they got them back.":
      ["Desde un primer Car Wrap hasta un proyecto completo de PPF y corrección — estas son las personas que nos dieron las llaves, y lo que dijeron al recuperarlas.",
       "Des d'un primer Car Wrap fins a un projecte complet de PPF i correcció — aquestes són les persones que ens van donar les claus, i el que van dir en recuperar-les."],
    "Avg Rating": ["Valoración media", "Valoració mitjana"],
    "Cars": ["Coches", "Cotxes"],
    "Referrals": ["Recomendaciones", "Recomanacions"],
    "Bring us the car": ["Tráenos el coche", "Porta'ns el cotxe"],
    "Hold us to the": ["Exígenos el", "Exigeix-nos l'"],
    "standard.": ["estándar.", "estàndard."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Premium Detailing & Customization":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Detailing y personalización premium",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Detailing i personalització premium"],

    /* ---------- SERVICE: shared ---------- */
    "The Transformation": ["La transformación", "La transformació"],
    "The Process": ["El proceso", "El procés"],
    "Drag to reveal": ["Desliza para revelar", "Llisca per revelar"],
    "Drag to compare before and after": ["Desliza para comparar antes y después", "Llisca per comparar abans i després"],
    "Before": ["Antes", "Abans"],
    "After": ["Después", "Després"],
    "Vehicle": ["Vehículo", "Vehicle"],
    "Coverage": ["Cobertura", "Cobertura"],
    "Warranty": ["Garantía", "Garantia"],
    "Finish": ["Acabado", "Acabat"],
    "Film": ["Film", "Film"],
    "Process": ["Proceso", "Procés"],
    "Effect": ["Efecto", "Efecte"],
    "Coating": ["Recubrimiento", "Recobriment"],
    "Lifespan": ["Durabilidad", "Durabilitat"],
    "Defects": ["Defectos", "Defectes"],
    "Turnaround": ["Plazo", "Termini"],
    "Kit": ["Kit", "Kit"],
    "Fitment": ["Encaje", "Encaix"],

    /* ---------- SERVICE: PPF ---------- */
    "SERRES — Paint Protection Film (PPF)": ["PPF en Barcelona — Protección de Pintura | SERRES", "PPF a Barcelona — Protecció de Pintura | SERRES"],
    "Service 03 · Paint Protection Film": ["Servicio 03 · Paint Protection Film", "Servei 03 · Paint Protection Film"],
    "Paint": ["Paint", "Paint"],
    "Armour": ["Armour", "Armour"],
    "An invisible urethane skin over your factory paint — absorbing stone chips, swirls, bug acid... So the finish underneath stays exactly as it left the studio. Available clear, gloss, satin and full colour-shift.":
      ["Una piel de uretano invisible sobre tu pintura de fábrica — absorbe impactos de piedra, micro-arañazos, ácido de insectos...Para que el acabado de debajo siga exactamente como salió del taller. Disponible en transparente, brillo, satinado y colour-shift completo.",
       "Una pell d'uretà invisible sobre la teva pintura de fàbrica — absorbeix impactes de pedra, micro-ratllades, àcid d'insectes... Perquè l'acabat de sota segueixi exactament com va sortir del taller. Disponible en transparent, brillant, setinat i colour-shift complet."],
    "Self-Healing": ["Autorreparable", "Autoreparable"],
    "Film Colours": ["Colores de film", "Colors de film"],
    "Gloss in.": ["Entra en brillo.", "Entra en brillant."],
    "Satin out.": ["Sale en satinado.", "Surt en setinat."],
    "This BMW M2 came in on factory gloss. We wrapped it in a full satin protection film — drag to reveal the new finish.":
      ["Este BMW M2 llegó en brillo de fábrica. Lo cubrimos con un film de protección satinado completo — desliza para revelar el nuevo acabado.",
       "Aquest BMW M2 va arribar en brillant de fàbrica. El vam cobrir amb un film de protecció setinat complet — llisca per revelar el nou acabat."],
    "Every panel was decontaminated, paint-corrected and measured before a single piece of film was laid. The satin PPF then went on edge-to-edge — bumper, arches, mirrors, door shuts — wrapping the factory gloss in a deep, stealth matte skin.":
      ["Cada panel fue descontaminado, corregido y medido antes de colocar una sola pieza de film. El PPF satinado se aplicó de borde a borde — paragolpes, pasos de rueda, espejos, marcos de puerta — envolviendo el brillo de fábrica en una piel mate sigilosa y profunda.",
       "Cada panell va ser descontaminat, corregit i mesurat abans de col·locar una sola peça de film. El PPF setinat es va aplicar de vora a vora — para-xocs, passos de roda, miralls, marcs de porta — embolcallant el brillant de fàbrica en una pell mat sigil·losa i profunda."],
    "The result is a colour-and-texture change and a protective layer in one: stone-chip resistance, self-healing topcoat and a finish that's fully reversible.":
      ["El resultado es un cambio de color y textura y una capa protectora en uno: resistencia a impactos de piedra, capa superior autorreparable y un acabado totalmente reversible.",
       "El resultat és un canvi de color i textura i una capa protectora alhora: resistència a impactes de pedra, capa superior autoreparable i un acabat totalment reversible."],
    "Satin Self-Healing PPF": ["PPF satinado autorreparable", "PPF setinat autoreparable"],
    "Full body wrap": ["Cobertura de carrocería completa", "Cobertura de carrosseria completa"],
    "Why PPF": ["Por qué PPF", "Per què PPF"],
    "Protection you": ["Protección que", "Protecció que"],
    "never see.": ["no se ve.", "no es veu."],
    "A premium film engineered to take the damage so your paint never does.":
      ["Un film premium diseñado para llevarse el daño y que tu pintura nunca lo sufra.",
       "Un film premium dissenyat per endur-se el dany perquè la teva pintura no el pateixi mai."],
    "Stone-chip": ["Defensa contra", "Defensa contra"],
    "defence": ["impactos", "impactes"],
    "Absorbs the impact of gravel, debris and road grit across the highest-risk panels.":
      ["Absorbe el impacto de gravilla, restos y suciedad de la carretera en los paneles de mayor riesgo.",
       "Absorbeix l'impacte de grava, restes i brutícia de la carretera als panells de més risc."],
    "Self-healing": ["Capa superior", "Capa superior"],
    "topcoat": ["autorreparable", "autoreparable"],
    "Light swirls and scratches vanish with heat from the sun or warm water.":
      ["Los micro-arañazos y rayas leves desaparecen con el calor del sol o agua caliente.",
       "Les micro-ratllades i ratlles lleus desapareixen amb la calor del sol o aigua calenta."],
    "Stain &": ["Resistente a", "Resistent a"],
    "UV resistant": ["manchas y UV", "taques i UV"],
    "Repels bug acid, sap, salt and fuel, and blocks the UV that fades paint over time.":
      ["Repele ácido de insectos, savia, sal y combustible, y bloquea los UV que decoloran la pintura con el tiempo.",
       "Repel·leix àcid d'insectes, saba, sal i combustible, i bloqueja els UV que descoloreixen la pintura amb el temps."],
    "Fully": ["Totalmente", "Totalment"],
    "removable": ["reversible", "reversible"],
    "Lifts cleanly years later with no residue — protecting resale and original finish.":
      ["Se retira limpio años después sin residuos — protegiendo el valor de reventa y el acabado original.",
       "Es retira net anys després sense residus — protegint el valor de revenda i l'acabat original."],
    "Three layers,": ["Tres capas,", "Tres capes,"],
    "one invisible skin.": ["una piel invisible.", "una pell invisible."],
    "Each PPF panel is a precision-engineered stack — a sacrificial self-healing topcoat, a shock-absorbing urethane core and a clear, conformable adhesive that disappears over your paint.":
      ["Cada panel de PPF es una estructura de precisión — una capa superior autorreparable de sacrificio, un núcleo de uretano que absorbe impactos y un adhesivo transparente y adaptable que desaparece sobre tu pintura.",
       "Cada panell de PPF és una estructura de precisió — una capa superior autoreparable de sacrifici, un nucli d'uretà que absorbeix impactes i un adhesiu transparent i adaptable que desapareix sobre la teva pintura."],
    "Self-healing topcoat": ["Capa superior autorreparable", "Capa superior autoreparable"],
    "Elastomeric · heals with heat": ["Elastomérica · cura con calor", "Elastomèrica · cura amb calor"],
    "Urethane core": ["Núcleo de uretano", "Nucli d'uretà"],
    "Impact & abrasion barrier": ["Barrera de impacto y abrasión", "Barrera d'impacte i abrasió"],
    "Clear adhesive": ["Adhesivo transparente", "Adhesiu transparent"],
    "Conformable · residue-free": ["Adaptable · sin residuos", "Adaptable · sense residus"],
    "Colour PPF": ["PPF de color", "PPF de color"],
    "Protect it.": ["Protégelo.", "Protegeix-lo."],
    "Express it.": ["Exprésalo.", "Expressa't."],
    "PPF isn't only clear. 50+ colours from several professional brands — gloss, satin, matte and colour-shift — a finish change and a shield in a single film.":
      ["El PPF no es solo transparente. Más de 50 colores de varias marcas profesionales — brillo, satinado, mate y colour-shift — un cambio de acabado y un escudo en un solo film.",
       "El PPF no és només transparent. Més de 50 colors de diverses marques professionals — brillant, setinat, mat i colour-shift — un canvi d'acabat i un escut en un sol film."],
    "Previous colour": ["Color anterior", "Color anterior"],
    "Next colour": ["Color siguiente", "Color següent"],
    "Finishes shown are representative of the protection film ranges we install. Final swatches confirmed in-studio under our lighting before application.":
      ["Los acabados mostrados son representativos de las gamas de film de protección con las que trabajamos. Las muestras finales se confirman en el taller bajo nuestra iluminación antes de aplicar.",
       "Els acabats mostrats són representatius de les gammes de film de protecció amb què treballem. Les mostres finals es confirmen al taller sota la nostra il·luminació abans d'aplicar."],
    "Shield your car": ["Blinda tu coche", "Blinda el teu cotxe"],
    "Protect what you": ["Protege lo que", "Protegeix el que"],
    "drive.": ["conduces.", "condueixes."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Paint Protection Film · Inozetek · 3M":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Paint Protection Film · Inozetek · 3M",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Paint Protection Film · Inozetek · 3M"],

    /* ---------- SERVICE: CERAMIC ---------- */
    "SERRES — Ceramic Coating": ["Tratamiento Cerámico para Coche en Barcelona | SERRES", "Tractament Ceràmic per a Cotxe a Barcelona | SERRES"],
    "Service 02 · Ceramic Coating": ["Servicio 02 · Ceramic Coating", "Servei 02 · Ceramic Coating"],
    "Liquid": ["Cristal", "Vidre"],
    "Glass": ["líquido", "líquid"],
    "Surface Hardness": ["Dureza superficial", "Duresa superficial"],
    "Protection": ["Protección", "Protecció"],
    "Water Contact": ["Contacto del agua", "Contacte de l'aigua"],
    "A SiO₂ Ceramic Coating that chemically bonds to the paint — sealing the gloss with a slick, hydrophobic layer that repels water, grime and UV for years.":
      ["Un tratamiento Ceramic Coating de SiO₂ que se adhiere químicamente a la pintura — sella el brillo con una capa hidrófoba y deslizante que repele agua, suciedad y UV durante años.",
       "Un tractament Ceramic Coating de SiO₂ que s'adhereix químicament a la pintura — segella la brillantor amb una capa hidròfoba i lliscant que repel·leix aigua, brutícia i UV durant anys."],
    "Water just": ["El agua", "L'aigua"],
    "lets go.": ["se suelta.", "es deixa anar."],
    "Same hood, same hex light. Drag the slider to watch flat, clinging water snap into tight beads that roll straight off.":
      ["Mismo capó, misma luz hexagonal. Desliza el control para ver cómo el agua plana y pegada se convierte en gotas apretadas que ruedan al instante.",
       "Mateix capó, mateixa llum hexagonal. Llisca el control per veure com l'aigua plana i enganxada es converteix en gotes atapeïdes que rodolen a l'instant."],
    "Before coating, water lies flat across the panel and clings — dragging dust, minerals and road film into the surface as it slowly dries into spots.":
      ["Antes del recubrimiento, el agua queda plana sobre el panel y se adhiere — arrastrando polvo, minerales y película de carretera a la superficie mientras se seca en manchas.",
       "Abans del recobriment, l'aigua queda plana sobre el panell i s'hi adhereix — arrossegant pols, minerals i pel·lícula de carretera a la superfície mentre s'asseca en taques."],
    "Once our ceramic layer cures, the surface energy drops dramatically. Water can't wet the paint, so it pulls into beads and sheets away — taking dirt with it and leaving the gloss untouched.":
      ["Una vez cura nuestra capa cerámica, la energía superficial cae drásticamente. El agua no puede mojar la pintura, así que forma gotas y resbala — llevándose la suciedad y dejando el brillo intacto.",
       "Un cop cura la nostra capa ceràmica, l'energia superficial cau dràsticament. L'aigua no pot mullar la pintura, així que forma gotes i llisca — emportant-se la brutícia i deixant la brillantor intacta."],
    "Sedan · Gloss Black": ["Sedán · Negro brillo", "Sedan · Negre brillant"],
    "SiO₂ ceramic · 2 layers": ["Cerámica SiO₂ · 2 capas", "Ceràmica SiO₂ · 2 capes"],
    "Hydrophobic · self-cleaning": ["Hidrófobo · autolimpiante", "Hidròfob · autonetejant"],
    "Up to 5 years": ["Hasta 5 años", "Fins a 5 anys"],
    "Prep. Coat.": ["Prepara. Aplica.", "Prepara. Aplica."],
    "Cure.": ["Cura.", "Cura."],
    "Ceramic is only as good as the surface beneath it. We correct and decontaminate first, then bond the coating and cure it in.":
      ["La cerámica solo es tan buena como la superficie de debajo. Primero corregimos y descontaminamos, luego adherimos el recubrimiento y lo curamos.",
       "La ceràmica només és tan bona com la superfície de sota. Primer corregim i descontaminem, després adherim el recobriment i el curem."],
    "Prep & Decon": ["Preparación y descontaminación", "Preparació i descontaminació"],
    "Wash · clay · paint correction": ["Lavado · clay · corrección de pintura", "Rentat · clay · correcció de pintura"],
    "Every defect is locked in forever once coated — so we decontaminate, clay and machine-correct the paint to a clean, swirl-free base first.":
      ["Cada defecto queda sellado para siempre una vez recubierto — por eso primero descontaminamos, pasamos clay y corregimos a máquina hasta una base limpia y sin micro-arañazos.",
       "Cada defecte queda segellat per sempre un cop recobert — per això primer descontaminem, passem clay i corregim a màquina fins a una base neta i sense micro-ratllades."],
    "Application": ["Aplicación", "Aplicació"],
    "SiO₂ ceramic · hand-levelled": ["Cerámica SiO₂ · nivelada a mano", "Ceràmica SiO₂ · anivellada a mà"],
    "The liquid coating is laid down panel by panel and levelled by hand in tight sections, bonding chemically with the clear coat as it flashes.":
      ["El recubrimiento líquido se aplica panel a panel y se nivela a mano en secciones pequeñas, adhiriéndose químicamente al barniz a medida que evapora.",
       "El recobriment líquid s'aplica panell a panell i s'anivella a mà en seccions petites, adherint-se químicament al vernís a mesura que s'evapora."],
    "Cure": ["Curado", "Curat"],
    "Controlled cure · 24h dwell": ["Curado controlado · 24h de reposo", "Curat controlat · 24h de repòs"],
    "The coating is left to cross-link and harden in a dust-free, climate-controlled bay — setting into the slick, glass-hard shell.":
      ["El recubrimiento se deja reticular y endurecer en un box sin polvo y con clima controlado — fraguando en una capa deslizante y dura como el cristal.",
       "El recobriment es deixa reticular i endurir en un box sense pols i amb clima controlat — fraguant en una capa lliscant i dura com el vidre."],
    "Water tells": ["El agua cuenta", "L'aigua explica"],
    "the whole story.": ["toda la historia.", "tota la història."],
    "Hydrophobic performance is measured by water contact angle — the higher the angle, the tighter water beads and the faster it sheets away. Bare paint barely holds a bead.":
      ["El rendimiento hidrófobo se mide por el ángulo de contacto del agua — cuanto mayor el ángulo, más apretadas las gotas y más rápido resbalan. La pintura desnuda apenas forma gota.",
       "El rendiment hidròfob es mesura per l'angle de contacte de l'aigua — com més gran l'angle, més atapeïdes les gotes i més ràpid llisquen. La pintura nua amb prou feines forma gota."],
    "Bare paint": ["Pintura desnuda", "Pintura nua"],
    "Ceramic coated": ["Con cerámica", "Amb ceràmica"],
    "Seal in the shine": ["Sella el brillo", "Segella la brillantor"],
    "Lock in the": ["Fija el", "Fixa la"],
    "gloss.": ["brillo.", "brillantor."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 SiO₂ Ceramic Coating":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Ceramic Coating SiO₂",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Ceramic Coating SiO₂"],

    /* ---------- SERVICE: DETAILING ---------- */
    "SERRES — Detailing": ["Detailing y Limpieza Interior de Coche en Barcelona | SERRES", "Detailing i Neteja Interior de Cotxe a Barcelona | SERRES"],
    "Service 05 · Detailing": ["Servicio 05 · Detailing", "Servei 05 · Detailing"],
    "Showroom": ["Como recién", "Com acabat"],
    "Fresh": ["entregado", "de lliurar"],
    "In & Out": ["Dentro y fuera", "Dins i fora"],
    "Hand Finished": ["Acabado a mano", "Acabat a mà"],
    "Cut Corners": ["Atajos", "Dreceres"],
    "A full reset for your car — steam-cleaned, decontaminated and hand-finished from the footwells to the paint. We bring back that just-delivered feeling, inside and out.":
      ["Un reinicio completo para tu coche — limpiado a vapor, descontaminado y acabado a mano desde los pies hasta la pintura. Devolvemos esa sensación de recién entregado, por dentro y por fuera.",
       "Un reinici complet per al teu cotxe — netejat a vapor, descontaminat i acabat a mà des dels peus fins a la pintura. Tornem aquella sensació d'acabat de lliurar, per dins i per fora."],
    "Interior Detailing": ["Detailing de interior", "Detailing d'interior"],
    "Lived-in": ["De usado", "De fet servir"],
    "to like-new.": ["a como nuevo.", "a com nou."],
    "Ground-in dust, dull plastics and tired leather — steam-cleaned, conditioned and reset until the cabin feels factory again.":
      ["Polvo incrustado, plásticos apagados y cuero cansado — limpiados a vapor, acondicionados y reiniciados hasta que el habitáculo se siente de fábrica otra vez.",
       "Pols incrustada, plàstics apagats i cuir cansat — netejats a vapor, condicionats i reiniciats fins que l'habitacle se sent de fàbrica un altre cop."],
    "Dust & Grime": ["Polvo y suciedad", "Pols i brutícia"],
    "Steam-Cleaned": ["Limpio a vapor", "Net a vapor"],
    "Exterior Detailing": ["Detailing de exterior", "Detailing d'exterior"],
    "Dust-caked": ["De lleno de polvo", "De ple de pols"],
    "to deep gloss.": ["a brillo profundo.", "a brillantor profunda."],
    "A full decontamination wash lifts road film and fallout, then we dry and dress every panel until the paint reads wet under the lights.":
      ["Un lavado de descontaminación completo retira la película de carretera y la contaminación férrica, luego secamos y tratamos cada panel hasta que la pintura se ve húmeda bajo las luces.",
       "Un rentat de descontaminació complet retira la pel·lícula de carretera i la contaminació fèrrica, després assequem i tractem cada panell fins que la pintura es veu humida sota els llums."],
    "Dusty & Dull": ["Sucio y apagado", "Brut i apagat"],
    "Deep Gloss": ["Brillo profundo", "Brillantor profunda"],
    "Strip. Clean.": ["Retira. Limpia.", "Retira. Neteja."],
    "Protect.": ["Protege.", "Protegeix."],
    "A full inside-and-out reset — we remove what's built up, clean down to the surface, then dress and protect every finish.":
      ["Un reinicio completo por dentro y por fuera — quitamos lo acumulado, limpiamos hasta la superficie, luego tratamos y protegemos cada acabado.",
       "Un reinici complet per dins i per fora — traiem l'acumulat, netegem fins a la superfície, després tractem i protegim cada acabat."],
    "Decontaminate": ["Descontaminar", "Descontaminar"],
    "Foam wash · clay · fallout": ["Lavado con espuma · clay · descontaminación", "Rentat amb escuma · clay · descontaminació"],
    "A pH-neutral foam bath lifts loose grime, then clay and iron remover pull out the bonded road film and brake fallout a wash leaves behind.":
      ["Un baño de espuma de pH neutro retira la suciedad suelta, luego el clay y el descontaminante férrico sacan la película de carretera y la contaminación de freno que deja un lavado.",
       "Un bany d'escuma de pH neutre retira la brutícia solta, després el clay i el descontaminant fèrric treuen la pel·lícula de carretera i la contaminació de fre que deixa un rentat."],
    "Deep Clean": ["Limpieza profunda", "Neteja profunda"],
    "Steam · extraction · brushes": ["Vapor · extracción · cepillos", "Vapor · extracció · raspalls"],
    "Inside, every panel, vent and seam is steamed and agitated; carpets and leather are extracted and wiped down until the cabin is truly clean.":
      ["Dentro, cada panel, rejilla y costura se trata a vapor y se cepilla; alfombras y cuero se extraen y se limpian hasta que el habitáculo está realmente limpio.",
       "Dins, cada panell, reixeta i costura es tracta a vapor i es raspalla; catifes i cuir s'extreuen i es netegen fins que l'habitacle està realment net."],
    "Dress & Protect": ["Tratar y proteger", "Tractar i protegir"],
    "Sealant · conditioner · UV": ["Sellador · acondicionador · UV", "Segellador · condicionador · UV"],
    "Paint is sealed for gloss and beading, trim and leather are conditioned and UV-protected, and the glass gets a rain-repellent treatment and is left streak-free.":
      ["La pintura se sella para brillo y repelencia, los plásticos y el cuero se acondicionan y protegen de los UV, y los cristales reciben un tratamiento antilluvia y quedan sin marcas.",
       "La pintura es segella per brillantor i repel·lència, els plàstics i el cuir es condicionen i es protegeixen dels UV, i els vidres reben un tractament antipluja i queden sense marques."],
    "Inside & out": ["Por dentro y por fuera", "Per dins i per fora"],
    "Make it feel": ["Haz que se sienta", "Fes que se senti"],
    "new again.": ["nuevo otra vez.", "nou un altre cop."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Interior & Exterior Detailing":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Detailing de interior y exterior",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Detailing d'interior i exterior"],

    /* ---------- SERVICE: PAINT CORRECTION ---------- */
    "SERRES — Paint Correction": ["Pulido y Corrección de Pintura de Coche en Barcelona | SERRES", "Polit i Correcció de Pintura de Cotxe a Barcelona | SERRES"],
    "Service 04 · Paint Correction": ["Servicio 04 · Corrección de pintura", "Servei 04 · Correcció de pintura"],
    "Staged": ["Pulido", "Polit"],
    "polishing": ["por etapas", "per etapes"],
    "Stage Polish": ["Pulido por etapas", "Polit per etapes"],
    "Defect Removal": ["Eliminación de defectos", "Eliminació de defectes"],
    "Holograms": ["Hologramas", "Hologrames"],
    "Multi-stage machine polishing that levels swirls, holograms and oxidation built up over years — restoring the true depth, gloss and clarity hiding under the surface of your paint.":
      ["Pulido a máquina multietapa que elimina micro-arañazos, hologramas y oxidación acumulados durante años — devolviendo la profundidad, el brillo y la claridad reales que se escondían bajo la superficie de tu pintura.",
       "Polit a màquina multietapa que elimina micro-ratllades, hologrames i oxidació acumulats durant anys — tornant la profunditat, la brillantor i la claredat reals que s'amagaven sota la superfície de la teva pintura."],
    "From hazy": ["De turbio", "De tèrbol"],
    "to mirror.": ["a espejo.", "a mirall."],
    "Same panel, same light. Drag the slider to see swirls and dullness give way to a flawless, reflective finish.":
      ["Mismo panel, misma luz. Desliza el control para ver cómo los micro-arañazos y la opacidad dan paso a un acabado impecable y reflectante.",
       "Mateix panell, mateixa llum. Llisca el control per veure com les micro-ratllades i l'opacitat donen pas a un acabat impecable i reflectant."],
    "This BMW arrived with years of wash-induced swirls and micro-marring dulling its gloss black — light scattering in every direction instead of reflecting cleanly.":
      ["Este BMW llegó con años de micro-arañazos de lavado y micro-marcas apagando su negro brillo — la luz dispersándose en todas direcciones en vez de reflejarse limpia.",
       "Aquest BMW va arribar amb anys de micro-ratllades de rentat i micro-marques apagant el seu negre brillant — la llum dispersant-se en totes direccions en lloc de reflectir-se neta."],
    "We assessed the clear coat, then cut, refined and finished the paint by machine until the defects were gone. The hex lighting now mirrors back razor-sharp, with deep, wet-looking reflections restored.":
      ["Evaluamos el estado del barniz, luego cortamos, refinamos y acabamos la pintura a máquina hasta eliminar los defectos. La luz hexagonal ahora se refleja nítida, con reflejos profundos y de aspecto húmedo restaurados.",
       "Vam avaluar l'estat del vernís, després vam tallar, refinar i acabar la pintura a màquina fins a eliminar els defectes. La llum hexagonal ara es reflecteix nítida, amb reflexos profunds i d'aspecte humit restaurats."],
    "BMW Coupé · Gloss Black": ["BMW Coupé · Negro brillo", "BMW Coupé · Negre brillant"],
    "Stage polishing · Stage 3": ["Pulido por etapas · Etapa 3", "Polit per etapes · Etapa 3"],
    "Swirls · holograms · oxidation": ["Micro-arañazos · hologramas · oxidación", "Micro-ratllades · hologrames · oxidació"],
    "Sealed & protected": ["Sellado y protegido", "Segellat i protegit"],
    "Stage 1. Stage 2.": ["Etapa 1. Etapa 2.", "Etapa 1. Etapa 2."],
    "Stage 3.": ["Etapa 3.", "Etapa 3."],
    "No two paints are alike: the polish adapts to the condition of your paint and the level of correction needed — from a one-stage enhancement to a full three-stage correction.":
      ["No hay dos pinturas iguales: el pulido se adapta al estado de tu pintura y al nivel de corrección necesario — desde un realce de una etapa hasta una corrección completa de tres.",
       "No hi ha dues pintures iguals: el polit s'adapta a l'estat de la teva pintura i al nivell de correcció necessari — des d'un realç d'una etapa fins a una correcció completa de tres."],
    "A measured, three-stage system — never a one-hit polish. We remove only what's needed and finish to true clarity.":
      ["Un sistema medido de tres etapas — nunca un pulido de una sola pasada. Eliminamos solo lo necesario y acabamos hasta una claridad real.",
       "Un sistema mesurat de tres etapes — mai un polit d'una sola passada. Eliminem només el necessari i acabem fins a una claredat real."],
    "Stage 1 · Cut": ["Etapa 1 · Corte", "Etapa 1 · Tall"],
    "Cutting pad · heavy compound": ["Boina de corte · compound agresivo", "Boina de tall · compound agressiu"],
    "The aggressive stage — levelling deeper scratches, swirls and oxidation by removing a precise micron-thin layer of clear coat.":
      ["La etapa agresiva — eliminando arañazos más profundos, micro-arañazos y oxidación al retirar una capa de barniz de micras precisa.",
       "L'etapa agressiva — eliminant ratllades més profundes, micro-ratllades i oxidació en retirar una capa de vernís de micres precisa."],
    "Stage 2 · Refine": ["Etapa 2 · Refinado", "Etapa 2 · Refinat"],
    "Polishing pad · medium polish": ["Boina de pulido · pulido medio", "Boina de polit · polit mitjà"],
    "The haze and micro-marring left by cutting are refined away, building back clarity and lifting gloss across the panel.":
      ["La turbidez y las micro-marcas que deja el corte se refinan, recuperando claridad y elevando el brillo en todo el panel.",
       "La tèrbolesa i les micro-marques que deixa el tall es refinen, recuperant claredat i elevant la brillantor a tot el panell."],
    "Stage 3 · Finish": ["Etapa 3 · Acabado", "Etapa 3 · Acabat"],
    "Finishing pad · fine polish": ["Boina de acabado · pulido fino", "Boina d'acabat · polit fi"],
    "The final jewelling pass eliminates holograms and brings paint to a true, defect-free mirror before it's sealed in.":
      ["La pasada final de jewelling elimina hologramas y lleva la pintura a un espejo real y sin defectos antes de sellarla.",
       "La passada final de jewelling elimina hologrames i porta la pintura a un mirall real i sense defectes abans de segellar-la."],
    "The numbers,": ["Los números,", "Els números,"],
    "not just the shine.": ["no solo el brillo.", "no només la brillantor."],
    "Gloss is expressed in GU (gloss units): the higher the number, the deeper and sharper the reflection. Typical results on neglected paint:":
      ["El brillo se expresa en GU (unidades de brillo): cuanto más alto, más profundo y nítido el reflejo. Resultados típicos en pintura descuidada:",
       "La brillantor s'expressa en GU (unitats de brillantor): com més alt, més profund i nítid el reflex. Resultats típics en pintura descuidada:"],
    "On arrival": ["A la llegada", "A l'arribada"],
    "After correction": ["Tras la corrección", "Després de la correcció"],
    "Restore the depth": ["Recupera la profundidad", "Recupera la profunditat"],
    "Bring back the": ["Devuelve el", "Torna la"],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Multi-Stage Machine Polishing":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Pulido por etapas a máquina",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Polit per etapes a màquina"],

    /* ---------- SERVICE: VINYL ---------- */
    "SERRES — Car Wrap / Vinyl": ["Car Wrap en Barcelona — Cambio de Color | SERRES", "Car Wrap a Barcelona — Canvi de Color | SERRES"],
    "Service 01 · Car Wrap": ["Servicio 01 · Car Wrap", "Servei 01 · Car Wrap"],
    "Car": ["Car", "Car"],
    "Film Colours ": ["Colores de film ", "Colors de film "],
    "Finish Families": ["Familias de acabado", "Famílies d'acabat"],
    "Pro film brands": ["Marcas profesionales", "Marques professionals"],
    "Reversible": ["Reversible", "Reversible"],
    "Film layers": ["Capas de film", "Capes de film"],
    "Layers": ["Capas", "Capes"],
    "Full or partial colour-change Car Wrap with films from several professional brands — matte, satin, gloss, metallic and colour-flip finishes, precision-fit and heat-sealed to every panel, edge and recess.":
      ["Car Wrap de cambio de color total o parcial con films de varias marcas profesionales — acabados mate, satinado, brillo, metalizado y colour-flip, ajustados con precisión y termosellados a cada panel, borde y recoveco.",
       "Car Wrap de canvi de color total o parcial amb films de diverses marques professionals — acabats mat, setinat, brillant, metal·litzat i colour-flip, ajustats amb precisió i termosegellats a cada panell, vora i racó."],
    "The Palette": ["La paleta", "La paleta"],
    "Every colour we": ["Todos los colores que", "Tots els colors que"],
    "can put on your car": ["podemos poner en tu coche", "podem posar al teu cotxe"],
    "We work with several professional brands. Pick the brand, filter by colour family and drag to explore.":
      ["Trabajamos con varias marcas profesionales. Elige la marca, filtra por familia de color y desliza para explorar.",
       "Treballem amb diverses marques professionals. Tria la marca, filtra per família de color i llisca per explorar."],
    "Scroll left": ["Desplazar a la izquierda", "Desplaça a l'esquerra"],
    "Scroll right": ["Desplazar a la derecha", "Desplaça a la dreta"],
    "One panel at": ["Un panel a", "Un panell a"],
    "a time.": ["la vez.", "la vegada."],
    "This BMW XM arrived in factory gloss black. We stripped it back, decontaminated every surface and re-skinned it in a deep satin-black film — bumper to roofline, mirror caps to door shuts.":
      ["Este BMW XM llegó en negro brillo de fábrica. Lo desnudamos, descontaminamos cada superficie y lo revestimos con un film negro satinado profundo — del paragolpes al techo, de los retrovisores a los marcos de puerta.",
       "Aquest BMW XM va arribar en negre brillant de fàbrica. El vam desnudar, descontaminar cada superfície i revestir amb un film negre setinat profund — del para-xocs al sostre, dels retrovisors als marcs de porta."],
    "Drag the slider to see the change. No paint touched, fully reversible, and protecting the original finish underneath.":
      ["Desliza el control para ver el cambio. Sin tocar la pintura, totalmente reversible y protegiendo el acabado original de debajo.",
       "Llisca el control per veure el canvi. Sense tocar la pintura, totalment reversible i protegint l'acabat original de sota."],
    "3M\u2122 2080 Satin Black": ["3M\u2122 2080 Satin Black", "3M\u2122 2080 Satin Black"],
    "Full body colour change": ["Cambio de color de carrocería completa", "Canvi de color de carrosseria completa"],
    "5–7 days": ["5–7 días", "5–7 dies"],
    "Book your wrap": ["Reserva tu Car Wrap", "Reserva el teu Car Wrap"],
    "Found your": ["¿Has encontrado tu", "Has trobat el teu"],
    "colour?": ["color?", "color?"],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Car Wrap · 3M · Avery Dennison · Inozetek":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Car Wrap · 3M · Avery Dennison · Inozetek",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Car Wrap · 3M · Avery Dennison · Inozetek"],

    /* ---------- SERVICE: BODY KITS ---------- */
    "SERRES — Body Kits": ["Montaje de Body Kits en Barcelona | SERRES", "Muntatge de Body Kits a Barcelona | SERRES"],
    "Service 06 · Body Kits": ["Servicio 06 · Body Kits", "Servei 06 · Body Kits"],
    "Built for": ["Hecho para", "Fet per a"],
    "Presence": ["impactar", "impactar"],
    "Kit Types": ["Tipos de kit", "Tipus de kit"],
    "Transformation": ["Transformación", "Transformació"],
    "Aero, stance and sound — engineered to look factory and hit harder. We fit all types of body kits, custom rims and exhaust tips to completely change how your car sits and reads on the road.":
      ["Aero, stance y sonido — diseñado para parecer de fábrica y pegar más fuerte. Montamos todo tipo de body kits, llantas a medida y colas de escape para cambiar por completo cómo se planta y se lee tu coche en la carretera.",
       "Aero, stance i so — dissenyat per semblar de fàbrica i pegar més fort. Muntem tot tipus de body kits, llandes a mida i sortides d'escapament per canviar del tot com es planta i es llegeix el teu cotxe a la carretera."],
    "Stock to": ["De serie a", "De sèrie a"],
    "street weapon.": ["arma de calle.", "arma de carrer."],
    "Same Golf GTI, same spot. Drag the slider to watch a factory rear turn into full aero — diffuser, spoiler, splitters and blacked-out tips.":
      ["Mismo Golf GTI, mismo sitio. Desliza el control para ver cómo una trasera de serie se convierte en aero completo — difusor, alerón, splitters y colas en negro.",
       "Mateix Golf GTI, mateix lloc. Llisca el control per veure com una part posterior de sèrie es converteix en aero complet — difusor, aleró, splitters i sortides en negre."],
    "This Mk7 GTI came in on its standard rear end — clean, but conservative. The owner wanted real road presence without touching the paint.":
      ["Este GTI Mk7 llegó con su trasera estándar — limpia, pero conservadora. El propietario quería presencia real en carretera sin tocar la pintura.",
       "Aquest GTI Mk7 va arribar amb la seva part posterior estàndard — neta, però conservadora. El propietari volia presència real a la carretera sense tocar la pintura."],
    "We fitted a full rear aero package: an aggressive diffuser, extended roof spoiler, side and rear splitters and gloss-black exhaust tips — all colour-matched and mounted to factory standards.":
      ["Montamos un paquete aero trasero completo: un difusor agresivo, alerón de techo extendido, splitters laterales y traseros y colas de escape en negro brillo — todo igualado en color y montado a estándares de fábrica.",
       "Vam muntar un paquet aero posterior complet: un difusor agressiu, aleró de sostre estès, splitters laterals i posteriors i sortides d'escapament en negre brillant — tot igualat en color i muntat a estàndards de fàbrica."],
    "VW Golf GTI Mk7 · Tornado Red": ["VW Golf GTI Mk7 · Tornado Red", "VW Golf GTI Mk7 · Tornado Red"],
    "Rear diffuser · spoiler · splitters": ["Difusor trasero · alerón · splitters", "Difusor posterior · aleró · splitters"],
    "Gloss-black exhaust tips": ["Colas de escape en negro brillo", "Sortides d'escapament en negre brillant"],
    "Bolt-on · OEM-grade": ["Atornillado · nivel OEM", "Cargolat · nivell OEM"],
    "What We Fit": ["Qué montamos", "Què muntem"],
    "Kits, rims": ["Kits, llantas", "Kits, llandes"],
    "& tips.": ["y colas.", "i sortides."],
    "We install all types of body kits, plus the details that finish the look — custom rims and exhaust tips, sourced and fitted with precision.":
      ["Instalamos todo tipo de body kits, además de los detalles que rematan el look — llantas a medida y colas de escape, suministradas y montadas con precisión.",
       "Instal·lem tot tipus de body kits, a més dels detalls que rematen el look — llandes a mida i sortides d'escapament, subministrades i muntades amb precisió."],
    "All types · OEM & aftermarket": ["Todos los tipos · OEM y aftermarket", "Tots els tipus · OEM i aftermarket"],
    "Front lips, splitters, side skirts, rear diffusers, spoilers and full widebody conversions — dry-fitted, colour-matched and mounted to factory standards.":
      ["Labios delanteros, splitters, faldones laterales, difusores traseros, alerones y conversiones widebody completas — montados en seco, igualados en color y fijados a estándares de fábrica.",
       "Llavis davanters, splitters, faldons laterals, difusors posteriors, alerons i conversions widebody completes — muntats en sec, igualats en color i fixats a estàndards de fàbrica."],
    "Custom Rims": ["Llantas a medida", "Llandes a mida"],
    "Sizing · finishes · fitment": ["Medidas · acabados · encaje", "Mides · acabats · encaix"],
    "The right wheel changes everything. We spec diameter, offset and finish to fill the arches and lock in the stance — then fit and balance them properly.":
      ["La llanta correcta lo cambia todo. Definimos diámetro, offset y acabado para llenar los pasos de rueda y fijar el stance — luego las montamos y equilibramos como toca.",
       "La llanda correcta ho canvia tot. Definim diàmetre, offset i acabat per omplir els passos de roda i fixar el stance — després les muntem i equilibrem com cal."],
    "Exhaust Tips": ["Colas de escape", "Sortides d'escapament"],
    "Gloss black · chrome · carbon": ["Negro brillo · cromo · carbono", "Negre brillant · crom · carboni"],
    "The finishing detail at the rear — blacked-out, polished or carbon tips, sized and aligned to sit clean against the bumper and diffuser.":
      ["El detalle final en la trasera — colas en negro, pulidas o de carbono, dimensionadas y alineadas para quedar limpias contra el paragolpes y el difusor.",
       "El detall final a la part posterior — sortides en negre, polides o de carboni, dimensionades i alineades per quedar netes contra el para-xocs i el difusor."],
    "Change the stance": ["Cambia el stance", "Canvia el stance"],
    "Give it real": ["Dale presencia", "Dona-li presència"],
    "presence.": ["de verdad.", "de veritat."],
    "© 2026 SERRES. All rights reserved. \u00A0·\u00A0 Body Kits · Custom Rims · Exhaust Tips":
      ["© 2026 SERRES. Todos los derechos reservados. \u00A0·\u00A0 Body Kits · Llantas a medida · Colas de escape",
       "© 2026 SERRES. Tots els drets reservats. \u00A0·\u00A0 Body Kits · Llandes a mida · Sortides d'escapament"],

    /* ===================================================================
       DATA-DRIVEN SECTIONS — rendered from JS, translated in-page via
       window.SERRES_I18N.t() and re-rendered on `serres:langchange`.
       =================================================================== */

    /* ---------- PRICES: tab labels + UI words ---------- */
    "Car Wrap": ["Car Wrap", "Car Wrap"],
    "Correction + Ceramic": ["Pulido + Cerámica", "Poliment + Ceràmica"],
    "pricing": ["precios", "preus"],
    "Most chosen": ["Más elegido", "Més triat"],
    "From": ["Desde", "Des de"],
    "from": ["desde", "des de"],
    "Book via WhatsApp": ["Reserva por WhatsApp", "Reserva per WhatsApp"],
    "Request a quote": ["Pide presupuesto", "Demana pressupost"],
    "On request": ["A consultar", "A consultar"],
    "Message us to calculate your price": ["Escríbenos para calcular tu precio", "Escriu-nos per calcular el teu preu"],
    "Feature": ["Característica", "Característica"],
    "Guide price": ["Precio orientativo", "Preu orientatiu"],

    /* ---------- PRICES: service blurbs ---------- */
    "Colour change with films from several professional brands — from subtle accents to a full identity change.":
      ["Cambio de color con films de varias marcas profesionales — desde acentos sutiles hasta un cambio de identidad completo.",
       "Canvi de color amb films de diverses marques professionals — des d'accents subtils fins a un canvi d'identitat complet."],
    "Self-healing paint protection film — 50+ colours from several professional brands — over the areas the road attacks first, or the whole car.":
      ["Film de protección de pintura autorreparable — más de 50 colores de varias marcas profesionales — sobre las zonas que la carretera ataca primero, o el coche entero.",
       "Film de protecció de pintura autoreparable — més de 50 colors de diverses marques professionals — sobre les zones que la carretera ataca primer, o el cotxe sencer."],
    "Stage polishing to remove the swirls, then a Ceramic Coating to lock the gloss in — the two steps that belong together.":
      ["Pulido por etapas para eliminar los micro-arañazos y, a continuación, un tratamiento Ceramic Coating que sella el brillo — los dos pasos que van de la mano.",
       "Polit per etapes per eliminar les micro-ratllades i, tot seguit, un tractament Ceramic Coating que segella la brillantor — els dos passos que van de la mà."],
    "Machine polishing that removes swirls, holograms and oxidation — measured, not guessed.":
      ["Pulido a máquina que elimina micro-arañazos, hologramas y oxidación — medido, no improvisado.",
       "Polit a màquina que elimina micro-ratllades, hologrames i oxidació — mesurat, no improvisat."],
    "From a proper reset wash to a full showroom revival, inside and out.":
      ["Desde un lavado de reinicio en condiciones hasta una renovación de exposición completa, por dentro y por fuera.",
       "Des d'un rentat de reinici en condicions fins a una renovació d'exposició completa, per dins i per fora."],
    "Aero and body work sourced, fitted and finished like it left the factory that way.":
      ["Aero y carrocería suministrados, montados y rematados como si saliera así de fábrica.",
       "Aero i carrosseria subministrats, muntats i rematats com si sortís així de fàbrica."],

    /* ---------- PRICES: tier names ---------- */
    "Accents": ["Acentos", "Accents"],
    "Full Colour Change": ["Cambio de color completo", "Canvi de color complet"],
    "Signature Wrap": ["Car Wrap Signature", "Car Wrap Signature"],
    "Front Pack": ["Pack frontal", "Pack frontal"],
    "Pro": ["Pro", "Pro"],
    "Full Body": ["Carrocería completa", "Carrosseria completa"],
    "Essential": ["Esencial", "Essencial"],
    "Enhancement": ["Realce", "Realç"],
    "Two-Stage": ["Dos etapas", "Dues etapes"],
    "Showroom Reset": ["Reinicio de exposición", "Reinici d'exposició"],
    "Aero Parts": ["Piezas aero", "Peces aero"],
    "Full Kit Fitted": ["Kit completo montado", "Kit complet muntat"],
    "Stage 1 polish to revive the gloss, then one ceramic layer to seal it — real protection, entry price.":
      ["Pulido de Etapa 1 que revive el brillo y, después, una capa cerámica que lo sella — protección real, precio de entrada.",
       "Polit d'Etapa 1 que reviu la brillantor i, després, una capa ceràmica que el segella — protecció real, preu d'entrada."],
    "Stage 2 correction plus a two-layer ceramic coat and rain-repellent glass — our standard.":
      ["Corrección de Etapa 2 más un recubrimiento cerámico de dos capas y antilluvia en los cristales — nuestro estándar.",
       "Correcció d'Etapa 2 més un recobriment ceràmic de dues capes i antipluja als vidres — el nostre estàndard."],
    "Full Stage 3 correction under hex lighting, then a multi-layer ceramic stack and interior protection.":
      ["Corrección completa de Etapa 3 bajo luz hexagonal y, después, varias capas cerámicas y protección de interior.",
       "Correcció completa d'Etapa 3 sota llum hexagonal i, després, diverses capes ceràmiques i protecció d'interior."],

    /* ---------- PRICES: tier descriptions ---------- */
    "Roof, mirrors and detail pieces — change the attitude, not the whole car.":
      ["Techo, retrovisores y piezas de detalle — cambia la actitud, no el coche entero.",
       "Sostre, retrovisors i peces de detall — canvia l'actitud, no el cotxe sencer."],
    "Every exterior panel wrapped edge-to-edge in the colour you actually wanted.":
      ["Cada panel exterior vinilado de borde a borde en el color que de verdad querías.",
       "Cada panell exterior vinilat de vora a vora en el color que realment volies."],
    "Premium and colour-flip films, with the service tailored to the vehicle configuration.":
      ["Films premium y camaleón — servicio según configuración del vehículo.",
       "Films premium i camaleó — servei segons configuració del vehicle."],
    "Bumper, partial bonnet and mirrors — the high-impact essentials covered.":
      ["Paragolpes, capó parcial y retrovisores — lo esencial de alto impacto, cubierto.",
       "Para-xocs, capó parcial i retrovisors — l'essencial d'alt impacte, cobert."],
    "Full bonnet, wings, bumper, mirrors and headlights — seamless coverage, sealed with a Ceramic Coating over the film.":
      ["Capó completo, aletas, paragolpes, retrovisores y faros — cobertura sin costuras, sellada con Ceramic Coating sobre el film.",
       "Capó complet, aletes, para-xocs, retrovisors i fars — cobertura sense costures, segellada amb Ceramic Coating sobre el film."],
    "Every painted panel protected, edges tucked — invisible armour, total peace of mind.":
      ["Cada panel pintado protegido, bordes ocultos — blindaje invisible, tranquilidad total.",
       "Cada panell pintat protegit, vores amagades — blindatge invisible, tranquil·litat total."],
    "Decontamination and a single coating layer — real protection, entry price.":
      ["Descontaminación y una capa de recubrimiento — protección real, precio de entrada.",
       "Descontaminació i una capa de recobriment — protecció real, preu d'entrada."],
    "Light polish, two coating layers, plus wheels and glass — our standard.":
      ["Pulido ligero, dos capas de recubrimiento, más llantas y cristales — nuestro estándar.",
       "Polit lleuger, dues capes de recobriment, més llandes i vidres — el nostre estàndard."],
    "Full polish, multi-layer stack, wheels-off coating and interior protection.":
      ["Pulido completo, varias capas, recubrimiento con llantas desmontadas y protección de interior.",
       "Polit complet, diverses capes, recobriment amb llandes desmuntades i protecció d'interior."],
    "Single-stage polish that revives gloss and clears light wash marring.":
      ["Pulido de una etapa que revive el brillo y elimina el micro-marcado de lavado.",
       "Polit d'una etapa que reviu la brillantor i elimina el micro-marcatge de rentat."],
    "Cut and refine — the sweet spot for most daily-driven paint.":
      ["Corte y refinado — el punto justo para la mayoría de pinturas de uso diario.",
       "Tall i refinat — el punt just per a la majoria de pintures d'ús diari."],
    "Three-stage correction finished under hex lighting and gloss readings.":
      ["Corrección de tres etapas rematada bajo luz hexagonal y mediciones de brillo.",
       "Correcció de tres etapes rematada sota llum hexagonal i mesuraments de brillantor."],
    "Exterior decontamination wash plus interior vacuum and wipe-down.":
      ["Lavado de descontaminación exterior más aspirado y repaso del interior.",
       "Rentat de descontaminació exterior més aspirat i repàs de l'interior."],
    "Steam-cleaned interior, extracted carpets, decontaminated exterior, sealed paint.":
      ["Interior limpiado a vapor, alfombras extraídas, exterior descontaminado, pintura sellada.",
       "Interior netejat a vapor, catifes extretes, exterior descontaminat, pintura segellada."],
    "Everything — engine bay, trim restoration, leather conditioning, 12-month sealant.":
      ["Todo — vano motor, restauración de plásticos, acondicionado de cuero, sellante de 12 meses.",
       "Tot — compartiment del motor, restauració de plàstics, condicionat de cuir, segellant de 12 mesos."],
    "Splitters, spoilers and diffusers — supplied and fitted with OEM-level care.":
      ["Splitters, alerones y difusores — suministrados y montados con cuidado de nivel OEM.",
       "Splitters, alerons i difusors — subministrats i muntats amb cura de nivell OEM."],
    "A complete body kit installed and paint-matched to your car.":
      ["Un body kit completo instalado e igualado en color a tu coche.",
       "Un body kit complet instal·lat i igualat en color al teu cotxe."],
    "Kit, wheels, stance and arch work — a different car when it rolls out.":
      ["Kit, llantas, stance y trabajo de pasos de rueda — otro coche cuando sale.",
       "Kit, llandes, stance i treball de passos de roda — un altre cotxe quan surt."],

    /* ---------- PRICES: turnaround notes ---------- */
    "From 1 day in the studio": ["Desde 1 día en el taller", "Des d'1 dia al taller"],
    "From 3–4 days in the studio": ["Desde 3–4 días en el taller", "Des de 3–4 dies al taller"],
    "From 5–7 days in the studio": ["Desde 5–7 días en el taller", "Des de 5–7 dies al taller"],
    "From 2–3 days in the studio": ["Desde 2–3 días en el taller", "Des de 2–3 dies al taller"],
    "From 5–8 days in the studio": ["Desde 5–8 días en el taller", "Des de 5–8 dies al taller"],
    "1 day in the studio": ["1 día en el taller", "1 dia al taller"],
    "1–2 days in the studio": ["1–2 días en el taller", "1–2 dies al taller"],
    "2–3 days in the studio": ["2–3 días en el taller", "2–3 dies al taller"],
    "3–4 days in the studio": ["3–4 días en el taller", "3–4 dies al taller"],
    "Approx. 3 hours": ["Aprox. 3 horas", "Aprox. 3 hores"],
    "From 3–5 days in the studio": ["Desde 3–5 días en el taller", "Des de 3–5 dies al taller"],
    "2–4 weeks · by consultation": ["2–4 semanas · con consulta", "2–4 setmanes · amb consulta"],

    /* ---------- PRICES: comparison-row labels ---------- */
    "Films from professional brands": ["Films de marcas profesionales", "Films de marques professionals"],
    "Service per vehicle configuration": ["Servicio según configuración del vehículo", "Servei segons configuració del vehicle"],
    "Premium & colour-flip films": ["Films premium y camaleón", "Films premium i camaleó"],
    "Design consultation": ["Consulta de diseño", "Consulta de disseny"],
    "Maintenance kit": ["Kit de mantenimiento", "Kit de manteniment"],
    "Film warranty": ["Garantía del film", "Garantia del film"],
    "Headlight protection": ["Protección de faros", "Protecció de fars"],
    "Wrapped edges — no visible lines": ["Bordes cubiertos — sin líneas visibles", "Vores cobertes — sense línies visibles"],
    "Door cups & sill protection": ["Protección de manetas y faldones", "Protecció de manetes i faldons"],
    "Ceramic Coating over film": ["Ceramic Coating sobre el film", "Ceramic Coating sobre el film"],
    "Paint preparation": ["Preparación de pintura", "Preparació de pintura"],
    "Coating layers": ["Capas de recubrimiento", "Capes de recobriment"],
    "Rain-repellent glass treatment": ["Antilluvia para los cristales", "Antipluja per als vidres"],
    "Interior leather & fabric": ["Cuero y tela del interior", "Cuir i tela de l'interior"],
    "Maintenance plan": ["Plan de mantenimiento", "Pla de manteniment"],
    "Rated durability": ["Durabilidad estimada", "Durabilitat estimada"],
    "Polishing stages": ["Etapas de pulido", "Etapes de polit"],
    "Hologram-free finish": ["Acabado sin hologramas", "Acabat sense hologrames"],
    "Protective sealant": ["Sellante protector", "Segellant protector"],
    "Ceramic upgrade available": ["Mejora cerámica disponible", "Millora ceràmica disponible"],
    "Exterior decon wash": ["Lavado de descontaminación exterior", "Rentat de descontaminació exterior"],
    "Interior vacuum & wipe-down": ["Aspirado y repaso interior", "Aspirat i repàs interior"],
    "Steam clean & carpet extraction": ["Limpieza a vapor y extracción de alfombras", "Neteja a vapor i extracció de catifes"],
    "Leather cleaned & conditioned": ["Cuero limpiado y acondicionado", "Cuir netejat i condicionat"],
    "Engine bay detail": ["Detallado del vano motor", "Detallat del compartiment del motor"],
    "Trim & plastics restored": ["Plásticos restaurados", "Plàstics restaurats"],
    "Paint sealant": ["Sellante de pintura", "Segellant de pintura"],
    "Scope": ["Alcance", "Abast"],
    "Supply & professional fitting": ["Suministro y montaje profesional", "Subministrament i muntatge professional"],
    "Paint-matched finish": ["Acabado igualado en color", "Acabat igualat en color"],
    "Fitment & clearance check": ["Comprobación de encaje y holguras", "Comprovació d'encaix i folgances"],
    "Arch & clearance work": ["Trabajo de pasos de rueda y holguras", "Treball de passos de roda i folgances"],
    "Wrap / PPF integration": ["Integración con Car Wrap / PPF", "Integració amb Car Wrap / PPF"],
    "Sourcing consultation": ["Asesoramiento de compra", "Assessorament de compra"],

    /* ---------- PRICES: comparison-cell values ---------- */
    "Roof · mirrors · accents": ["Techo · retrovisores · acentos", "Sostre · retrovisors · accents"],
    "Full exterior": ["Exterior completo", "Exterior complet"],
    "Full exterior + door shuts": ["Exterior completo + marcos", "Exterior complet + marcs"],
    "Optional": ["Opcional", "Opcional"],
    "3 yr": ["3 años", "3 anys"],
    "5 yr": ["5 años", "5 anys"],
    "2 yr": ["2 años", "2 anys"],
    "Bumper + partial bonnet": ["Paragolpes + capó parcial", "Para-xocs + capó parcial"],
    "Full front end": ["Frontal completo", "Frontal complet"],
    "Every painted panel": ["Cada panel pintado", "Cada panell pintat"],
    "Decon wash": ["Lavado de descon.", "Rentat de descon."],
    "Decon + light polish": ["Descon. + pulido ligero", "Descon. + polit lleuger"],
    "Decon + full polish": ["Descon. + pulido completo", "Descon. + polit complet"],
    "Stage 1 — enhance": ["Etapa 1 — realce", "Etapa 1 — realç"],
    "Stage 2 — cut & refine": ["Etapa 2 — corte y refinado", "Etapa 2 — tall i refinat"],
    "Stage 3 — full correction": ["Etapa 3 — corrección completa", "Etapa 3 — correcció completa"],
    "6 months": ["6 meses", "6 mesos"],
    "12 months": ["12 meses", "12 mesos"],
    "Splitter · spoiler · diffuser": ["Splitter · alerón · difusor", "Splitter · aleró · difusor"],
    "Complete body kit": ["Body kit completo", "Body kit complet"],
    "Kit + wheels + stance": ["Kit + llantas + stance", "Kit + llandes + stance"],

    /* ---------- WHY SERRES: testimonial roles, services, quotes ---------- */
    "BMW M2 · Owner": ["BMW M2 · Propietario", "BMW M2 · Propietari"],
    "Golf GTI · Owner": ["Golf GTI · Propietario", "Golf GTI · Propietari"],
    "Porsche 911 · Owner": ["Porsche 911 · Propietario", "Porsche 911 · Propietari"],
    "Mercedes G-Class · Collector": ["Mercedes G-Class · Coleccionista", "Mercedes G-Class · Col·leccionista"],
    "Audi RS6 · Owner": ["Audi RS6 · Propietario", "Audi RS6 · Propietari"],
    "Range Rover · Owner": ["Range Rover · Propietario", "Range Rover · Propietari"],
    "Satin PPF": ["PPF satinado", "PPF setinat"],
    "Full Wrap": ["Car Wrap completo", "Car Wrap complet"],
    "PPF + Ceramic": ["PPF + Cerámica", "PPF + Ceràmica"],
    "Excellent service from start to finish. The treatment is genuinely exceptional — very professional, attentive to every detail and always ready to offer a personalised experience. I brought my Golf GTI in for a black wrap and the result was flawless, beyond my expectations. I'm delighted with both the finish and the whole process. Without a doubt, a place I thoroughly recommend.":
      ["Un servicio excelente de principio a fin. El trato es realmente excepcional: muy profesionales, atentos a cada detalle y siempre dispuestos a ofrecer una experiencia personalizada. Llevé mi Golf GTI para realizar un Car Wrap en negro y el resultado ha sido impecable, superando mis expectativas. Estoy muy contento tanto con el acabado como con todo el proceso en general. Sin duda, un lugar totalmente recomendable.",
       "Un servei excel·lent de principi a fi. El tracte és realment excepcional: molt professionals, atents a cada detall i sempre disposats a oferir una experiència personalitzada. Vaig portar el meu Golf GTI per fer un Car Wrap en negre i el resultat ha estat impecable, superant les meves expectatives. Estic molt content tant amb l'acabat com amb tot el procés en general. Sens dubte, un lloc totalment recomanable."],
    "Years of swirls just… gone. They walked me round the car panel by panel under the hex lights. You can see your reflection in the roof like a mirror.":
      ["Años de micro-arañazos simplemente… desaparecidos. Me enseñaron el coche panel a panel bajo la luz hexagonal. Te ves reflejado en el techo como en un espejo.",
       "Anys de micro-ratllades simplement… desapareguts. Em van ensenyar el cotxe panell a panell sota la llum hexagonal. Et veus reflectit al sostre com en un mirall."],
    "Colour change on the G-Class was flawless — every shut line and edge finished properly. This is a proper studio.":
      ["El cambio de color del clase G fue impecable — cada marco y borde rematado como toca. Esto es un taller de verdad.",
       "El canvi de color del classe G va ser impecable — cada marc i vora rematats com cal. Això és un taller de debò."],
    "Booked the full front PPF and a ceramic on top. Communication was perfect, timeline was exact, and the car came back cleaner than the showroom.":
      ["Reservé el PPF frontal completo y una cerámica encima. La comunicación fue perfecta, los plazos exactos, y el coche volvió más limpio que en el concesionario.",
       "Vaig reservar el PPF frontal complet i una ceràmica a sobre. La comunicació va ser perfecta, els terminis exactes, i el cotxe va tornar més net que al concessionari."],
    "The interior detail genuinely felt like a new car. They care about the parts nobody photographs.":
      ["El detallado de interior hizo que pareciera un coche nuevo de verdad. Se preocupan por las partes que nadie fotografía.",
       "El detallat d'interior va fer que semblés un cotxe nou de debò. Es preocupen per les parts que ningú fotografia."],

    /* ---------- VINYL / PPF: finish families (display only — data-finish
       attribute keeps its English value for CSS + filtering) ---------- */
    "All": ["Todos", "Tots"],
    "Satin": ["Satinado", "Setinat"],
    "Matte": ["Mate", "Mat"],
    "Color Flip": ["Camaleón", "Camaleó"],
    "Colour Shift": ["Camaleón", "Camaleó"],
    "Flip": ["Camaleón", "Camaleó"],
    "Gloss Metallic": ["Brillo metalizado", "Brillant metal·litzat"],
    "Satin Metallic": ["Satinado metalizado", "Setinat metal·litzat"],
    "Matte Metallic": ["Mate metalizado", "Mat metal·litzat"],
    "Metallic": ["Metalizado", "Metal·litzat"],
    "Frozen Matte": ["Frozen Matte", "Frozen Matte"],
    "Pearl": ["Perla", "Perla"],

    /* ---------- STRINGS BAKED IN SPANISH (added when the HTML source
       was converted to Spanish; EN key = original English text) ---------- */
    "PPF · Wraps · Paint Correction": ["PPF · Car Wrap · Corrección de pintura", "PPF · Car Wrap · Correcció de pintura"],
    "Detailing Studio": ["Estudio de detailing", "Estudi de detailing"],
    "SERRES Wrap Center on Google Maps": ["SERRES Wrap Center en Google Maps", "SERRES Wrap Center a Google Maps"],
    "Factory Gloss": ["Brillo de fábrica", "Brillant de fàbrica"],
    "SERRES Satin Wrap": ["Car Wrap satinado SERRES", "Car Wrap setinat SERRES"],
    "Water Sheets Flat": ["El agua queda plana", "L'aigua queda plana"],
    "Beads & Rolls Off": ["Forma gotas y resbala", "Forma gotes i llisca"],
    "yr": ["años", "anys"],
    "Swirled & Hazy": ["Micro-arañazos y turbidez", "Micro-ratllades i tèrbolesa"],
    "Corrected Gloss": ["Brillo corregido", "Brillantor corregida"],
    "Factory Rear": ["Trasera de serie", "Part posterior de sèrie"],
    "Full Aero Kit": ["Kit aero completo", "Kit aero complet"],
    "Choose a service": ["Elige un servicio", "Tria un servei"],
    "The Studio": ["El estudio", "L'estudi"],
    "Land Rover · Satin Black Wrap": ["Land Rover · Car Wrap negro satinado", "Land Rover · Car Wrap negre setinat"],
    "A Range Rover Sport taken from factory gloss to a deep satin-black vinyl wrap — every panel, mirror and pillar colour-matched, then shot under the hexagon lights so the new finish does the talking.":
      ["Un Range Rover Sport llevado del brillo de fábrica a un Car Wrap negro satinado profundo — cada panel, retrovisor y pilar igualado en color, fotografiado después bajo las luces hexagonales para que el nuevo acabado hable por sí solo.",
       "Un Range Rover Sport portat del brillant de fàbrica a un Car Wrap negre setinat profund — cada panell, retrovisor i pilar igualat en color, fotografiat després sota les llums hexagonals perquè el nou acabat parli per si sol."],
    "Satin Black": ["Negro satinado", "Negre setinat"],
    "Front three-quarter": ["Tres cuartos delantero", "Tres quarts davanter"],
    "Satin Wrap": ["Car Wrap satinado", "Car Wrap setinat"],
    "Head-on": ["De frente", "De front"],
    "Image viewer": ["Visor de imágenes", "Visor d'imatges"],
    "Close viewer": ["Cerrar visor", "Tanca el visor"],
    "Previous image": ["Imagen anterior", "Imatge anterior"],
    "Next image": ["Imagen siguiente", "Imatge següent"],
    "Satin black · Front three-quarter": ["Negro satinado · Tres cuartos delantero", "Negre setinat · Tres quarts davanter"],
    "Head-on · Satin black finish": ["De frente · Acabado negro satinado", "De front · Acabat negre setinat"],

    /* ---------- SEO META DESCRIPTIONS (baked in Spanish in the HTML;
       EN key = legacy English description shown when switching to EN) ---------- */
    "SERRES — premium automotive detailing & customization. PPF, vinyl wraps, body kits, custom rims, paint correction, interior & exterior deep cleaning.":
      ["Estudio premium en Sant Cugat del Vallès: PPF, Car Wrap, Ceramic Coating, pulido por etapas y detailing. Presupuesto por WhatsApp.",
       "Estudi premium a Sant Cugat del Vallès: PPF, Car Wrap, Ceramic Coating, polit per etapes i detailing. Pressupost per WhatsApp."],
    "SERRES PPF — self-healing paint protection film that shields high-impact areas from stone chips, swirls and the road. Available clear, gloss, satin and colour-shift finishes.":
      ["Instalación de PPF autorreparable con más de 50 colores de varias marcas profesionales. Packs frontal y coche completo desde 890 €. Sant Cugat, Barcelona.",
       "Instal·lació de PPF autoreparable amb més de 50 colors de diverses marques professionals. Packs frontal i cotxe complet des de 890 €. Sant Cugat, Barcelona."],
    "SERRES Car Wrap — full and partial colour-change wraps with films from several professional brands. Matte, satin, gloss, metallic and colour-flip finishes, precision-fit to every panel.":
      ["Car Wrap: cambio de color con films 3M, Avery Dennison e Inozetek. Más de 150 colores. Coche completo desde 1.490 €. Sant Cugat del Vallès.",
       "Car Wrap: canvi de color amb films 3M, Avery Dennison i Inozetek. Més de 150 colors. Cotxe complet des de 1.490 €. Sant Cugat del Vallès."],
    "SERRES Ceramic Coating — a liquid-glass SiO₂ layer that bonds to your paint for years of hydrophobic, high-gloss, swirl-resistant protection.":
      ["Tratamiento Ceramic Coating SiO2 con hasta 5 años de protección. Preparación y pulido según pack. Desde 340 €. Sant Cugat, Barcelona.",
       "Tractament Ceramic Coating SiO2 amb fins a 5 anys de protecció. Preparació i polit segons pack. Des de 340 €. Sant Cugat, Barcelona."],
    "SERRES Paint Correction — multi-stage machine polishing that removes swirls, holograms and oxidation to restore true, mirror-clear depth to your paint.":
      ["Pulido por etapas a máquina: Etapa 1, 2 o 3 según el estado de tu pintura. Adiós a arañazos, remolinos y hologramas. Sant Cugat, Barcelona.",
       "Polit per etapes a màquina: Etapa 1, 2 o 3 segons l'estat de la teva pintura. Adéu a esgarrapades, remolins i hologrames. Sant Cugat, Barcelona."],
    "SERRES Detailing — deep interior steam-cleaning and exterior decontamination that takes your car from neglected to showroom-fresh, inside and out.":
      ["Limpieza integral: vapor, tapicería, cuero y motor. Deep Clean desde 150 €, Showroom Reset desde 490 €. Estudio premium en Sant Cugat.",
       "Neteja integral: vapor, tapisseria, cuir i motor. Deep Clean des de 150 €, Showroom Reset des de 490 €. Estudi premium a Sant Cugat."],
    "SERRES Body Kits — aggressive aero, custom rims and exhaust tips fitted to factory standards. We install all types of body kits to transform stance and presence.":
      ["Instalación y pintura de body kits, spoilers y widebody con ajuste OEM. Desde 450 €. Sant Cugat del Vallès.",
       "Instal·lació i pintura de body kits, spoilers i widebody amb ajust OEM. Des de 450 €. Sant Cugat del Vallès."],
    "SERRES pricing — transparent guide prices for wraps, PPF, ceramic coating, paint correction, detailing and body kits. Three levels per service, from essential to concours.":
      ["Precios orientativos con IVA de todos los servicios SERRES: PPF, Car Wrap, Ceramic Coating, pulido por etapas, detailing y body kits.",
       "Preus orientatius amb IVA de tots els serveis SERRES: PPF, Car Wrap, Ceramic Coating, polit per etapes, detailing i body kits."],
    "Why SERRES — obsessive prep, measured results and premium materials under one roof. The standards behind every car that leaves our Barcelona studio.":
      ["Un estudio premium en Sant Cugat: materiales certificados, preparación meticulosa y un 98% de clientes que nos recomiendan.",
       "Un estudi premium a Sant Cugat: materials certificats, preparació meticulosa i un 98% de clients que ens recomanen."],
    "SERRES Gallery — a car-by-car showroom of wraps, PPF, corrections and full builds shot in and around our Barcelona studio.":
      ["Coches transformados en SERRES: PPF, Car Wrap, Ceramic Coating y detailing. Fotos reales de nuestro estudio.",
       "Cotxes transformats a SERRES: PPF, Car Wrap, Ceramic Coating i detailing. Fotos reals del nostre estudi."],
    "The SERRES Exclusive — our limited full-build programme. PPF, wrap, correction, ceramic, interior and body work on one car, under one vision. A handful of builds per year.":
      ["Exclusivo SERRES: la transformación completa. Un coche, una visión.",
       "Exclusiu SERRES: la transformació completa. Un cotxe, una visió."]
  };

  /* ===================================================================
     INVERTED INDEX — Spanish rendition → English dictionary key.
     The HTML source is authored in Spanish, so bindings are discovered
     by looking the (trimmed) Spanish text up here; the stored binding
     key stays English so tr()/t() keep working unchanged.
     =================================================================== */
  var INV = {};
  (function () {
    for (var k in DICT) {
      if (!DICT.hasOwnProperty(k)) continue;
      var v = (DICT[k][0] || "").replace(/^\s+|\s+$/g, "");
      if (v && !INV.hasOwnProperty(v)) INV[v] = k;
    }
  })();

  /* resolve a DOM text core (EN or ES) to its English dictionary key */
  function enKeyOf(core) {
    if (DICT.hasOwnProperty(core)) return core;
    if (INV.hasOwnProperty(core)) return INV[core];
    return null;
  }

  /* ===================================================================
     ENGINE
     =================================================================== */
  function getLang() {
    var l;
    try { l = localStorage.getItem(STORE); } catch (e) {}
    return LANGS.indexOf(l) >= 0 ? l : "es";
  }
  var current = getLang();

  function tr(core) {
    if (current === "en") return core;
    var e = DICT[core];
    if (!e) return core;
    var v = current === "es" ? e[0] : e[1];
    return v == null ? core : v;
  }

  /* split a raw text value into leading/trailing whitespace (+ wrapping
     quotes) and a translatable core, so we restore surroundings exactly */
  function affix(raw) {
    var lead = "", trail = "", core = raw, m;
    if ((m = core.match(/^\s+/))) { lead = m[0]; core = core.slice(m[0].length); }
    if ((m = core.match(/\s+$/))) { trail = m[0]; core = core.slice(0, core.length - m[0].length); }
    if (core.length > 1) {
      var f = core.charAt(0), l = core.charAt(core.length - 1);
      if ((f === "\u201C" || f === '"') && (l === "\u201D" || l === '"')) {
        lead += f; trail = l + trail; core = core.slice(1, core.length - 1);
      }
    }
    return { lead: lead, core: core, trail: trail };
  }

  var textBindings = [];   // {node, lead, core, trail}
  var attrBindings = [];   // {el, attr, lead, core, trail}
  var keyBindings = [];    // {el, lead, core, trail} — explicit [data-en] elements
  var seenText = (typeof WeakSet !== "undefined") ? new WeakSet() : null;
  var ATTRS = ["aria-label", "title"];

  function inSkip(node) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    return !!(el && el.closest && el.closest("[data-i18n-skip]"));
  }

  function bindText(tn) {
    if (seenText && seenText.has(tn)) return;
    var raw = tn.nodeValue;
    if (!raw || !raw.trim()) return;
    var p = tn.parentNode;
    if (!p) return;
    var tag = p.nodeName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return;
    if (inSkip(tn)) return;
    if (p.nodeType === 1 && p.hasAttribute && p.hasAttribute("data-en")) return;
    var a = affix(raw);
    var key = enKeyOf(a.core);
    if (key == null) return;
    if (seenText) seenText.add(tn);
    var b = { node: tn, lead: a.lead, core: key, trail: a.trail };
    textBindings.push(b);
    applyText(b);
  }

  function applyText(b) {
    var val = b.lead + tr(b.core) + b.trail;
    if (b.node.nodeValue !== val) b.node.nodeValue = val;
  }

  function bindAttrs(el) {
    if (!el.getAttribute || inSkip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var attr = ATTRS[i];
      if (!el.hasAttribute(attr)) continue;
      var raw = el.getAttribute(attr);
      if (!raw || !raw.trim()) continue;
      var a = affix(raw);
      var enKey = enKeyOf(a.core);
      if (enKey == null) continue;
      var key = "__i18n_" + attr;
      if (el[key]) continue;            // already bound
      el[key] = true;
      var b = { el: el, attr: attr, lead: a.lead, core: enKey, trail: a.trail };
      attrBindings.push(b);
      applyAttr(b);
    }
  }

  function applyAttr(b) {
    b.el.setAttribute(b.attr, b.lead + tr(b.core) + b.trail);
  }

  /* explicit keyed elements: <span data-en="a reality"></span> */
  function bindKeyed(el) {
    if (!el.getAttribute || inSkip(el)) return;
    if (el.__i18n_keyed) return;
    var raw = el.getAttribute("data-en");
    if (!raw) return;
    var a = affix(raw);
    if (!DICT.hasOwnProperty(a.core)) return;
    el.__i18n_keyed = true;
    var b = { el: el, lead: a.lead, core: a.core, trail: a.trail };
    keyBindings.push(b);
    applyKeyed(b);
  }

  function applyKeyed(b) {
    var v = tr(b.core);
    var out = v ? b.lead + v + b.trail : "";
    if (b.el.textContent !== out) b.el.textContent = out;
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { bindText(root); return; }
    if (root.nodeType !== 1) return;
    if (inSkip(root)) return;
    // text nodes
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    var n, batch = [];
    while ((n = tw.nextNode())) batch.push(n);
    batch.forEach(bindText);
    // attributes (self + descendants)
    bindAttrs(root);
    var els = root.querySelectorAll("[aria-label],[title]");
    for (var i = 0; i < els.length; i++) bindAttrs(els[i]);
    // explicit keyed fragments (self + descendants)
    bindKeyed(root);
    var kd = root.querySelectorAll("[data-en]");
    for (var k = 0; k < kd.length; k++) bindKeyed(kd[k]);
  }

  /* meta: <title> + description */
  var titleBind = null, descBind = null;
  function bindMeta() {
    var t = enKeyOf((document.title || "").trim());
    if (t != null) titleBind = t;
    var md = document.querySelector('meta[name="description"]');
    if (md) {
      var c = enKeyOf((md.getAttribute("content") || "").trim());
      if (c != null) descBind = { el: md, core: c };
    }
  }
  function applyMeta() {
    if (titleBind) document.title = tr(titleBind);
    if (descBind) descBind.el.setAttribute("content", tr(descBind.core));
  }

  function applyAll() {
    document.documentElement.setAttribute("lang", current);
    for (var i = 0; i < textBindings.length; i++) applyText(textBindings[i]);
    for (var j = 0; j < attrBindings.length; j++) applyAttr(attrBindings[j]);
    for (var k = 0; k < keyBindings.length; k++) applyKeyed(keyBindings[k]);
    applyMeta();
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === current) {
      if (l === current) syncSwitchers();
      return;
    }
    current = l;
    try { localStorage.setItem(STORE, l); } catch (e) {}
    applyAll();
    syncSwitchers();
    try {
      window.dispatchEvent(new CustomEvent("serres:langchange", { detail: l }));
    } catch (e2) {
      var ev = document.createEvent("CustomEvent");
      ev.initCustomEvent("serres:langchange", false, false, l);
      window.dispatchEvent(ev);
    }
  }

  /* ===================================================================
     SWITCHER UI
     =================================================================== */
  var switchers = [];

  function injectStyle() {
    if (document.getElementById("srs-i18n-style")) return;
    var css =
      ".srs-lang{display:inline-flex;align-items:center;flex:none;border:1px solid var(--line-strong,rgba(255,255,255,.16));" +
        "border-radius:999px;overflow:hidden;background:rgba(255,255,255,.02)}" +
      ".srs-lang button{font-family:'Barlow Condensed',sans-serif;font-weight:600;text-transform:uppercase;" +
        "letter-spacing:.12em;font-size:12.5px;line-height:1;color:var(--muted,#9a9aa3);background:transparent;" +
        "border:0;cursor:pointer;padding:8px 10px;transition:color .25s var(--ease,ease),background .25s var(--ease,ease)}" +
      ".srs-lang button+button{border-left:1px solid var(--line,rgba(255,255,255,.09))}" +
      ".srs-lang button:hover{color:var(--text,#f3f3f5)}" +
      ".srs-lang button.on{background:var(--chrome,#e7e7ec);color:#0a0a0b}" +
      ".srs-lang button.on:hover{color:#0a0a0b}" +
      /* mobile-menu variant — bigger tap targets */
      ".srs-lang.srs-lang-menu{border-radius:12px}" +
      ".srs-lang.srs-lang-menu button{font-size:15px;letter-spacing:.16em;padding:12px 16px}" +
      "@media(max-width:760px){.srs-lang.srs-lang-nav button{padding:7px 9px;font-size:12px}}";
    var st = document.createElement("style");
    st.id = "srs-i18n-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function makeSwitcher(variant) {
    var box = document.createElement("div");
    box.className = "srs-lang " + variant;
    box.setAttribute("data-i18n-skip", "");
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Language / Idioma");
    LANGS.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = LABELS[l];
      b.setAttribute("data-lang", l);
      b.setAttribute("aria-label", LABELS[l]);
      b.addEventListener("click", function () { setLang(l); });
      box.appendChild(b);
    });
    switchers.push(box);
    syncSwitchers();
    return box;
  }

  function syncSwitchers() {
    switchers.forEach(function (box) {
      var bs = box.querySelectorAll("button");
      for (var i = 0; i < bs.length; i++) {
        var on = bs[i].getAttribute("data-lang") === current;
        bs[i].classList.toggle("on", on);
        bs[i].setAttribute("aria-pressed", on ? "true" : "false");
      }
    });
  }

  function mountSwitchers() {
    /* desktop: into .nav-right, before the quote button */
    var navRight = document.querySelector("header .nav-right");
    if (navRight && !navRight.querySelector(".srs-lang")) {
      navRight.insertBefore(makeSwitcher("srs-lang-nav"), navRight.firstChild);
    }
    /* mobile overlay menu foot (built by serres-enhance.js) */
    var foot = document.querySelector(".srs-menu-foot");
    if (foot && !foot.querySelector(".srs-lang")) {
      foot.insertBefore(makeSwitcher("srs-lang-menu"), foot.firstChild);
    }
  }

  /* ===================================================================
     OBSERVER — translate dynamically-added static content
     =================================================================== */
  function observe() {
    if (typeof MutationObserver === "undefined") return;
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType === 1 || node.nodeType === 3) walk(node);
        }
      }
      // a new mobile menu may have appeared
      mountSwitchers();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ===================================================================
     INIT
     =================================================================== */
  function init() {
    injectStyle();
    bindMeta();
    walk(document.body);
    mountSwitchers();
    applyAll();
    observe();
    // expose a tiny API
    window.SERRES_I18N = {
      get: function () { return current; },
      set: setLang,
      t: tr
    };
    // Let data-driven sections (price tiers, testimonials, finish filters)
    // render themselves in the stored language on first load.
    try {
      window.dispatchEvent(new CustomEvent("serres:langchange", { detail: current }));
    } catch (e3) {
      var ev2 = document.createEvent("CustomEvent");
      ev2.initCustomEvent("serres:langchange", false, false, current);
      window.dispatchEvent(ev2);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
