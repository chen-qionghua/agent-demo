const path = require('path')
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.resolve.alias['@ant-design/pro-layout'] = path.resolve(__dirname, 'components/pro-layout-shim.tsx')
    config.resolve.alias['@ant-design/pro-table'] = path.resolve(__dirname, 'components/pro-table-shim.tsx')

    if (!isServer) {
      config.externals.push({
        react: 'React',
        'react-dom': 'ReactDOM',
        antd: 'antd',
      })
    }
    // 允许加载worker脚本
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
      exclude: /node_modules/,
    })

    // 配置图片加载
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    })
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}
module.exports = nextConfig
