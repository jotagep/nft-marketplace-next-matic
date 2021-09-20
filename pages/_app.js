import '../styles/globals.css'
import Link from 'next/link'


const HeaderLink = ({children, href}) =>
  <Link href={href}>
    <a className="mr-4 p-2 hover:text-pink-500">
      {children}
    </a>
  </Link>

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="flex justify-between border-b p-6">
        <h1 className="text-4xl font-bold">NFT Marketplace</h1>
        <div className="flex items-center">     
          <HeaderLink href="/">
              Home
          </HeaderLink>
          <HeaderLink href="/create-item">
              Sell Digital Asset
          </HeaderLink>
          <HeaderLink href="/my-assets">
              My Digital Assets
          </HeaderLink>
          <HeaderLink href="/my-assets">
              Creator Dashboard
          </HeaderLink>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
