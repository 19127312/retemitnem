module.exports = {
    printWidth: 160,
    tabWidth: 4,
    trailingComma: 'none',
    semi: true,
    singleQuote: true,
    htmlWhitespaceSensitivity: 'css',
    quoteProps: 'as-needed',
    overrides: [
        {
            files: '*.css',
            options: {
                parser: 'css'
            }
        },
        {
            files: '*.scss',
            options: {
                parser: 'scss'
            }
        }
    ]
};
