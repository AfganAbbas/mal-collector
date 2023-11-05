
# Myanimelist data collector

A scraper that collects data from mal, and writes it to the mysql table


## Usage

For starting scraper in production:

```bash
  npm run start
```
For starting scraper in development:

```bash
  npm run dev
```
For reseting database:

```bash
  npm run drop
```
## API Reference

#### Get all collected animes from the table

```http
  GET /api/v1/anime
```
