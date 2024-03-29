import headerNavLinks from '@data/headerNavLinks'
import Link from './Link'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import RSS from './RSS'

const LayoutWrapper = ({ children }) => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-1 w-full mx-auto">
          <header className="z-40 lg:z-50 lg:mx-auto">
            <div className="max-w-screen-lg flex items-center align-center justify-between pt-6 px-6 mx-auto">
              <div className="flex items-baseline">
                <div className="mr-6 lg:mr-12">
                  <Link href="/" aria-label="Joel Hans">
                    <div className="text-2xl font-sans font-medium leading-none text-sea hover:text-steel">
                      Joel Hans
                    </div>
                  </Link>
                </div>
                <div className="flex-1 lg:flex justify-start">
                  <div className="hidden sm:block">
                    {headerNavLinks.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        className="text-gray-900 dark:text-gray-200 text-base leading-none font-medium mr-4 md:mr-8 hover:text-sea dark:hover:text-sea transition-all"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center">
                <ThemeSwitch />
                <RSS />
                <MobileNav />
              </div>
            </div>
          </header>
          <main className="max-w-screen-lg mx-auto mb-auto px-6">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default LayoutWrapper
