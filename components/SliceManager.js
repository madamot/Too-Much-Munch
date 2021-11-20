import React from 'react'
// import Hero from './hero';

const SliceManager = ({slices}) => {
    return slices.map((slice, index) => {
        const res = (() => {
          switch(slice.__typename) {
            case 'ComponentSlicesHero': return (
              <div key={ slice.id }>
                {/* <Hero slice={slice} /> */}
                <p>{slice.content.title}</p>
              </div>
            )
    
            // case 'ComponentPagesText': return (
            //   <div key={ index } className="slice">
            //     <div key={ slice.id }>
            //       <Imageslice slice={slice} />
            //     </div>
            //   </div>
            // )
    
            // case 'ComponentPagesMultipleImages': return (
            //     <Section key={ slice.id }>
            //       <Multipleimages slice={slice} />
            //     </Section>
            //     )
    
            // case 'ComponentPagesQuote': return (
            //   <div key={ index } className="slice">
            //     <Quote slice={slice} />
            //   </div>
            // )
    
            default: return <p>oh</p>
          }
        })();
        return res;
      })
}

export default SliceManager