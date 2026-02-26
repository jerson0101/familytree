-- =====================================================
-- KinTree Seed Data
-- Run this AFTER 002_rls_and_functions.sql
-- =====================================================

-- Insert default DYK questions (global, family_id = NULL)
INSERT INTO dyk_questions (family_id, question, category, difficulty, answer_type, points) VALUES
-- Maternal line (7 questions)
(NULL, '¿Cuál es el nombre de soltera de tu abuela materna?', 'maternal', 'easy', 'text', 5),
(NULL, '¿Dónde nació tu abuela materna?', 'maternal', 'easy', 'text', 5),
(NULL, '¿Cuál era el apodo de tu madre cuando era niña?', 'maternal', 'medium', 'text', 10),
(NULL, '¿En qué año se casaron tus abuelos maternos?', 'maternal', 'medium', 'date', 10),
(NULL, '¿Cuál era la profesión de tu abuelo materno?', 'maternal', 'easy', 'text', 5),
(NULL, '¿Cuántos hermanos tiene/tenía tu madre?', 'maternal', 'easy', 'text', 5),
(NULL, '¿Cuál era la receta favorita de tu abuela materna?', 'maternal', 'medium', 'text', 10),

-- Paternal line (6 questions)
(NULL, '¿Cuál es el nombre de soltera de tu abuela paterna?', 'paternal', 'easy', 'text', 5),
(NULL, '¿Dónde creció tu abuelo paterno?', 'paternal', 'medium', 'text', 10),
(NULL, '¿Cuál fue el primer trabajo de tu padre?', 'paternal', 'easy', 'text', 5),
(NULL, '¿Cómo se conocieron tus abuelos paternos?', 'paternal', 'hard', 'text', 15),
(NULL, '¿Cuál era la receta favorita de tu abuela paterna?', 'paternal', 'medium', 'text', 10),
(NULL, '¿Cuántos hermanos tiene/tenía tu padre?', 'paternal', 'easy', 'text', 5),

-- Self/Personal (4 questions)
(NULL, '¿Cuál es la historia detrás de tu nombre?', 'self', 'easy', 'text', 5),
(NULL, '¿Qué tradición familiar recuerdas con más cariño?', 'self', 'easy', 'text', 5),
(NULL, '¿Cuál es la reliquia familiar más antigua que conoces?', 'self', 'medium', 'text', 10),
(NULL, '¿Qué historia familiar se cuenta siempre en las reuniones?', 'self', 'easy', 'text', 5),

-- Extended family (7 questions)
(NULL, '¿Cuántos primos hermanos tienes?', 'extended', 'easy', 'text', 5),
(NULL, '¿De qué país emigraron tus antepasados?', 'extended', 'medium', 'text', 10),
(NULL, '¿Quién es el pariente vivo más longevo de tu familia?', 'extended', 'easy', 'text', 5),
(NULL, '¿Algún familiar sirvió en el ejército? ¿Cuándo y dónde?', 'extended', 'hard', 'text', 15),
(NULL, '¿Qué condiciones médicas son comunes en tu familia?', 'extended', 'medium', 'text', 10),
(NULL, '¿Hasta qué generación puedes trazar tu árbol familiar?', 'extended', 'hard', 'text', 15),
(NULL, '¿Cuál es el origen del apellido de tu familia?', 'extended', 'medium', 'text', 10)

ON CONFLICT DO NOTHING;

-- Insert default detective challenges
INSERT INTO detective_challenges (title, description, category, difficulty, points, requirements, suggested_questions) VALUES
(
    'Entrevista a un Abuelo',
    'Graba una conversación con un abuelo sobre sus recuerdos de infancia',
    'interview',
    'medium',
    50,
    ARRAY['Graba al menos 15 minutos de conversación', 'Pregunta sobre su casa de infancia', 'Aprende sobre sus experiencias escolares', 'Documenta al menos 3 datos familiares nuevos'],
    ARRAY['¿Cómo era tu casa cuando eras niño?', '¿A qué jugabas de pequeño?', '¿Cómo era la escuela para ti?', '¿Cuál era tu comida familiar favorita?']
),
(
    'Digitaliza Fotos Antiguas',
    'Encuentra y escanea al menos 5 fotos familiares de antes de 1980',
    'photo',
    'easy',
    25,
    ARRAY['Encuentra al menos 5 fotos de antes de 1980', 'Escanéalas en alta resolución', 'Etiqueta cada foto con nombres y fechas aproximadas', 'Súbelas al árbol familiar'],
    NULL
),
(
    'Investiga Registros de Inmigración',
    'Encuentra registros de inmigración o viaje de un antepasado que vino de otro país',
    'research',
    'hard',
    100,
    ARRAY['Identifica un antepasado que inmigró', 'Busca en bases de datos de inmigración', 'Documenta el nombre del barco, fecha y puerto de entrada', 'Encuentra su ciudad de origen'],
    NULL
),
(
    'Crea un Recetario Familiar',
    'Recopila y documenta 5 recetas tradicionales de la familia',
    'documentation',
    'medium',
    40,
    ARRAY['Reúne 5 recetas de familiares', 'Documenta el origen e historia de cada receta', 'Incluye historias familiares asociadas con el plato', 'Añade fotos si es posible'],
    NULL
),
(
    'Mapa de Ubicaciones Familiares',
    'Crea un mapa de todos los lugares donde tu familia ha vivido a través de generaciones',
    'research',
    'medium',
    35,
    ARRAY['Investiga dónde vivieron al menos 3 generaciones', 'Documenta direcciones o ciudades cuando sea posible', 'Anota fechas aproximadas para cada ubicación', 'Identifica patrones de migración'],
    NULL
),
(
    'Árbol de Oficios y Profesiones',
    'Documenta las profesiones de al menos 10 familiares a través de las generaciones',
    'research',
    'medium',
    30,
    ARRAY['Lista las profesiones de 10+ familiares', 'Incluye al menos 3 generaciones', 'Identifica patrones o tradiciones laborales', 'Añade historias interesantes sobre sus trabajos'],
    NULL
),
(
    'Certificado o Documento Histórico',
    'Encuentra y digitaliza un certificado de nacimiento, matrimonio o defunción de hace más de 50 años',
    'documentation',
    'hard',
    75,
    ARRAY['Localiza un documento oficial de más de 50 años', 'Digitalízalo en alta calidad', 'Transcribe la información importante', 'Añade el documento al árbol familiar'],
    NULL
),
(
    'Historia de la Casa Familiar',
    'Documenta la historia de la casa donde creció alguno de tus abuelos',
    'research',
    'medium',
    45,
    ARRAY['Identifica la dirección exacta si es posible', 'Investiga cuándo fue construida', 'Recopila fotos antiguas de la casa', 'Documenta quiénes vivieron allí y cuándo'],
    NULL
)

ON CONFLICT DO NOTHING;
