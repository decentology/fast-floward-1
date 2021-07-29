import classnames from 'classnames';
import {useState} from 'react';

import Picture from '../../model/Picture.js';

import './Frame.css';

const constants = {
  pixel: {
    fill: {
      [Picture.offPixel]: 'var(--material-grey-200)',
      [Picture.onPixel]: 'var(--material-grey-800)'
    }
  },
  icon: {
    length: 32
  }
};

function Frame(props) {
  const [activePixel, setActivePixel] = useState(null);
  const [brush, setBrush] = useState(null);
  const isInteractive = props.onTogglePixel;
  
  const width = (
    props.grid.columns
    * (props.pixel.width + props.pixel.spacing)
    - props.pixel.spacing
  );
  const height = (
    props.grid.rows
    * (props.pixel.height + props.pixel.spacing)
    - props.pixel.spacing
  );

  const pixels = [];

  const onTogglePixel = (index) => {
    setBrush(
      props.picture.pixelAt(index) === Picture.onPixel
      ? Picture.offPixel
      : Picture.onPixel
    )
    props.onTogglePixel(index);
  }
  const onOverPixel = (index, isPrimaryPressed = false) => {
    setActivePixel(index);
    if (isPrimaryPressed) {
      props.onTogglePixel(index, brush);
    }
  };
  const onOutPixel = () => {
    setActivePixel(null);
  };

  for (let row = 0; row < props.grid.rows; row += 1) {
    for (let column = 0; column < props.grid.columns; column += 1) {
      const index = row * props.grid.columns + column;
      const x = column * (props.pixel.width + props.pixel.spacing);
      const y = row * (props.pixel.height + props.pixel.spacing);
      let fill = constants.pixel.offFill;
      if (props.picture) {
        fill = constants.pixel.fill[props.picture.pixelAt(index)];
      }

      const isOn = props.picture.pixelAt(index) === Picture.onPixel;

      pixels.push(
        <svg
          key={index}
          className={classnames({
            'pixel': true,
            'is-interactive': isInteractive
          })}
          x={x}
          y={y}
          onMouseDown={() => isInteractive && onTogglePixel(index)}
          onMouseEnter={(event) => isInteractive && onOverPixel(index, event.buttons === 1)}
          onMouseLeave={onOutPixel}
        >
          <rect
            x={0}
            y={0}
            width={props.pixel.width}
            height={props.pixel.height}
            rx={props.pixel.cornerRadius}
            fill={fill}
            className={isOn ? 'isOn' : ''}
          />
          {isInteractive && activePixel === index &&
            <svg
              width={constants.icon.length}
              height={constants.icon.length}
              x={props.pixel.width/2 - constants.icon.length/2}
              y={props.pixel.height/2 - constants.icon.length/2}
              viewBox="0 0 24 24"
              fill={constants.icon.fill}
            >
              <rect
                x={0}
                y={0}
                width={24}
                height={24}
                rx={24}
                fill="var(--material-grey-100)"
              />
              {props.picture.pixelAt(index) === Picture.offPixel &&
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="var(--material-green-400)" />
              }
              {props.picture.pixelAt(index) === Picture.onPixel &&
                <path d="M19 13H5v-2h14v2z" fill="var(--material-red-400)" />
              }
            </svg>
          }
        </svg>
      );
    }
  }

  return (
    <svg
      className="frame"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      {pixels}
    </svg>
  );
}

export default Frame;