import Header from "../header/header"
import Footer from "../footer/footer"
import styles from './layout.module.css'

export default function Layout({ children }) {
  return (
    <>
      <Header></Header>
      <div className={styles.container}>
        <main>{children}</main>
      </div>
      <Footer></Footer>
    </>
    )
  }
