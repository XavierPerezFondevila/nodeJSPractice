const express = require('express');
const crypto = require('node:crypto');
const movies = require('./movies.json');
const { validateMovie } = require('./movies');

const app = express();
app.use(express.json());

app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

app.get('/movies', (req, res) => {
    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(movie => {
            return movie.genre.some(g => g.toLowerCase() === genre.toLowerCase());
        });
        return res.json(filteredMovies);
    }

    res.json(movies);
});

app.post('/movies', (req, res) => {
    const result = validateMovie(req.body);
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    };

    console.info(newMovie)
    movies.push(newMovie);

    res.status(201).json(newMovie);
});

app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (movie) return res.json(movie);

    return res.status(404).json({ message: 'Movie not found' });
});


const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
    console.log(`Server listening on port: http://localhost:${PORT}`);
})