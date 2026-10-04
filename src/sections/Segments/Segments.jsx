import { Marquee } from '../../components/Marquee/Marquee'
import { SectionHeading } from '../../components/SectionHeading/SectionHeading'
import { segmentRows } from '../../data/segments'
import './Segments.css'

const ROW_DIRECTIONS = ['left', 'right']
const ROW_DURATIONS = [46, 52]

export function Segments() {
  return (
    <section
      id="segmentos"
      className="section theme-light segments"
      data-network-state="segments"
      aria-labelledby="segments-title"
    >
      <div className="container">
        <SectionHeading
          id="segments-title"
          eyebrow="Segmentos"
          title="Experiência em diferentes segmentos"
          lead="Soluções de infraestrutura e segurança para diferentes necessidades e ambientes empresariais."
          align="center"
        />
      </div>

      <div className="segments__rows">
        {segmentRows.map((row, index) => (
          <Marquee
            key={row[0]}
            items={row}
            direction={ROW_DIRECTIONS[index % ROW_DIRECTIONS.length]}
            duration={ROW_DURATIONS[index % ROW_DURATIONS.length]}
            label={index === 0 ? 'Segmentos atendidos' : 'Mais segmentos atendidos'}
          />
        ))}
      </div>
    </section>
  )
}
