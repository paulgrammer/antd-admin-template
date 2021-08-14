module.exports = {
    apps: [
        {
            name: 'ADMIN',
        },
    ],
    deploy: {
        production: {
            user: 'deploy',
            host: ['159.65.157.79'],
            ref: 'origin/main',
            repo:
                'git@github.com:CREATIVE-GROUP-INTERNATIONAL-LIMITED/softphone-ui.git',
            path: '/home/deploy/ui',
            'post-deploy':
                'npm install && npm run build && pm2 serve build 3001 --spa',
            env: {
                NODE_ENV: 'production',
            },
        },
    },
}
