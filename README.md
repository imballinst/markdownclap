# Markdown Clap

Generally, updating Markdown is easy. We can just use our text editor or use a lot of online tools that allow Markdown previewing. However, one of the pain points that I felt when editing Markdown was when updating tables. When I need to remove a row with ordered numbers, I need to also update ALL ROWS below the deleted row. This is a chore and I think it is a room for improvement.

## Main Features

1. Markdown preview
2. Markdown inspection, with supported elements including:
   2.1. Tables

## Development

### Requirements

1. Node.js® 16
2. Yarn Classic

### Starting the development server

```bash
# Install deps
yarn

# Start the development server
yarn dev
```

### Testing

```bash
yarn test
```

### Publishing

At the moment, the site is published to GitHub pages: https://imballinst.github.io/markdownclap. This is automated on every push to `main` branch.

## License

MIT
