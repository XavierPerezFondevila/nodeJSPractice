const z = require('zod');

const moveSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
    }),
    year: z.number().int().min(1950).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(
            ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi'],
            {
                required_error: 'Movie genre is required',
                invalid_type_error: 'Movie genre must be an accepted one',
            }
        )
    )
});

const validateMovie = (obj) => {
    return moveSchema.safeParse(obj);
};

module.exports = {
    validateMovie
}