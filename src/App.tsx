import React, {useState} from 'react';
import {Input} from './component/form-controls/Input';
import {Select} from './component/form-controls/Select';
import styles from './App.module.scss';

namespace EditorConfig {
  export type Charset = 'latin1' | 'utf-8' | 'utf-8-bom' | 'utf-16be' | 'utf-16le';
  export type IndentStyle = 'space' | 'tab';
  export type EndOfLine = 'lf' | 'cr' | 'crlf';
  export type Boolean = 'true' | 'false';
  export type config = {
    charset?: Charset,
    indent_style?: IndentStyle,
    end_of_line?: EndOfLine,
    indent_size?: number,
    tab_width?: number,
    trim_trailing_whitespace?: 'true' | 'false',
    insert_final_newline?: 'true' | 'false',
  };
}
type Rule = {
  root: 'true' | '',
  config: {
    [x: string]: string,
  }[],
};
const keySort = [
  'indent_style',
  'indent_size',
  'tab_width',
  'end_of_line',
  'charset',
  'trim_trailing_whitespace',
  'insert_final_newline',
];
const spec = {
  string: {
    charset: ['latin1', 'utf-8', 'utf-8-bom', 'utf-16be', 'utf-16le'],
  },
  select: {
    indent_style: ['space', 'tab'],
    end_of_line: ['lf', 'cr', 'crlf'],
    trim_trailing_whitespace: ['true', 'false'],
    insert_final_newline: ['true', 'false'],
  },
} as {
  [x: string]: {
    [x: string]: string[],
  },
};

const parse = (value: string) => {
  const state = {
    i: 0,
    ext: '*',
  };
  const config: Rule = {
    root: '',
    config: [],
  };

  for (const row of value.split('\n')) {
    const str = row.trim().replace(/\s/g, '');

    if (!str) {
      continue;
    }

    if (
      str.startsWith('root=') &&
      state.i === 0
    ) {
      config.root = str === 'root=true' ? 'true' : '';

      continue;
    }

    if (str.startsWith('[')) {
      state.ext = str.replace(/\[/g, '').replace(/\].*$/g, '');

      if (config.config[state.i]) {
        state.i++;
      }
    }

    if (!config.config[state.i]) {
      config.config[state.i] = {
        __pattern__: state.ext,
      };
    }

    if (str.includes('=')) {
      const [key, value] = str.split('=');

      config.config[state.i][key] = value;
    }
  }

  return config;
};

const toString = (config: Rule) => {
  const result: string[] = [];

  if (config.root) {
    result.push('root = true');
  }

  for (const item of config.config) {
    const entries = Object.entries(item).sort((a, b) => {
      const n1 = keySort.indexOf(a[0]);
      const n2 = keySort.indexOf(b[0]);

      if (n1 < n2) {
        return -1;
      }
      if (n1 > n2) {
        return 1;
      }

      return 0;
    });

    result.push('\n');
    result.push(`[${item.__pattern__}]`);

    for (const [key, value] of entries) {
      if (
        value &&
        key !== '__pattern__'
      ) {
        result.push(`${key} = ${value}`);
      }
    }
  }


  return result.join('\n').trim().replace(/\n\n/g, '\n');
};

const defaultConfig: Rule = {
  root: 'true',
  config: [
    {
      __pattern__: '*',
      indent_style: 'space',
      indent_size: '2',
      tab_width: '',
      end_of_line: 'lf',
      charset: 'utf-8',
      trim_trailing_whitespace: 'true',
      insert_final_newline: 'true',
    },
    {
      __pattern__: '*.md',
      indent_style: '',
      indent_size: '',
      tab_width: '',
      end_of_line: '',
      charset: '',
      trim_trailing_whitespace: 'false',
      insert_final_newline: '',
    },
  ],
};

function App() {
  const [textValue, setTextValue] = useState(toString(defaultConfig));
  const [config, setConfig] = useState<Rule>(defaultConfig);
  const getOnChange = (idx: number, label: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    config.config[idx][label] = e.target.value;

    setConfig({
      ...config,
    });
    setTextValue(toString(config));
  };

  const createForms = (_config: Rule) => {
    const __config = _config.config;

    return (
      <>
        <p className={styles.checkboxRoot}>
          <Select
            label="root"
            value={_config.root}
            options={[
              <option key="true">true</option>,
            ]}
            onChange={(e) => {
              config.root = e.target.value === 'true' ? 'true' : '';

              setTextValue(toString(config));
              setConfig({
                ...config,
              });
            }}
          />
        </p>

        <p className={styles.btn}>
          <button
            onClick={() => {
              config.config.unshift({
                __pattern__: '*',
              });

              setTextValue(toString(config));
              setConfig({
                ...config,
              });
            }}
          >
            先頭に追加
          </button>
        </p>

        <div>
          {
            __config.map((item, idx) => (
              <fieldset
                key={idx}
                aria-labelledby={`rule-${idx}`}
                className={styles.fieldset}
              >
                <h3
                  id={`rule-${idx}`}
                  className={styles.legend}
                >
                  Rule {idx + 1}
                </h3>

                <p className={styles.row}>
                  <Input
                    label="pattern"
                    value={item.__pattern__}
                    onChange={(e) => {
                      item.__pattern__ = e.target.value;

                      setTextValue(toString(config));
                      setConfig({
                        ...config,
                      });
                    }}
                  />
                </p>

                <p className={styles.row}>
                  <Select
                    label="indent_style"
                    value={item.indent_style}
                    onChange={getOnChange(idx, 'indent_style')}
                    options={
                      spec.select.indent_style.map((value) => (
                        <option key={value}>{value}</option>
                      ))
                    }
                  />
                </p>

                <p className={styles.row}>
                  <Input
                    type="number"
                    label="indent_size"
                    value={item.indent_size}
                    onChange={getOnChange(idx, 'indent_size')}
                  />
                </p>

                <p className={styles.row}>
                  <Input
                    type="number"
                    label="tab_width"
                    value={item.tab_width}
                    onChange={getOnChange(idx, 'tab_width')}
                  />
                </p>

                <p className={styles.row}>
                  <Select
                    label="end_of_line"
                    value={item.end_of_line}
                    onChange={getOnChange(idx, 'end_of_line')}
                    options={
                      spec.select.end_of_line.map((value) => (
                        <option key={value}>{value}</option>
                      ))
                    }
                  />
                </p>

                <p className={styles.row}>
                  <Input
                    label="charset"
                    value={item.charset}
                    onChange={getOnChange(idx, 'charset')}
                  />
                </p>

                <p className={styles.row}>
                  <Select
                    label="trim_trailing_whitespace"
                    value={item.trim_trailing_whitespace}
                    onChange={getOnChange(idx, 'trim_trailing_whitespace')}
                    options={
                      spec.select.trim_trailing_whitespace.map((value) => (
                        <option key={value}>{value}</option>
                      ))
                    }
                  />
                </p>

                <p className={styles.row}>
                  <Select
                    label="insert_final_newline"
                    value={item.insert_final_newline}
                    onChange={getOnChange(idx, 'insert_final_newline')}
                    options={
                      spec.select.insert_final_newline.map((value) => (
                        <option key={value}>{value}</option>
                      ))
                    }
                  />
                </p>

                <p className={styles.lytBtn}>
                  <span className={styles.lytBtn__item}>
                    <button
                      onClick={() => {
                        config.config = [
                          ...config.config.slice(0, idx + 1),
                          {
                            __pattern__: '*',
                          },
                          ...config.config.slice(idx + 1),
                        ];

                        setTextValue(toString(config));
                        setConfig({
                          ...config,
                        });
                      }}
                    >
                      この下に追加
                    </button>
                  </span>

                  <span className={styles.lytBtn__item}>
                    <button
                      onClick={() => {
                        const newConfig = config.config.filter((item, i) => (
                          i !== idx
                        ));
                        config.config = newConfig;

                        setTextValue(toString(config));
                        setConfig({
                          ...config,
                        });
                      }}
                    >
                      削除
                    </button>
                  </span>
                </p>
              </fieldset>
            ))
          }
        </div>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {
        Object.entries(spec.string).map(([key, list]) => (
          <datalist id={key} key={key}>
            {
              list.map((value) => (
                <option key={value}>{value}</option>
              ))
            }
          </datalist>
        ))
      }

      <div className={styles.config}>
        <h2>
          Config
        </h2>

        {
          createForms(config)
        }
      </div>

      <div className={styles.output}>
        <h2>
          <label htmlFor="textarea">Output</label>
        </h2>

        <p className={styles.btn}>
          <button
            onClick={() => {
              setTextValue(toString(config));
              setConfig({
                ...config,
              });
            }}
          >
            整形する
          </button>
        </p>

        <p className={styles.output__field}>
          <textarea
            className={styles.textarea}
            id="textarea"
            onChange={(e) => {
              const value = e.target.value.replace(/#.*$/gm, '');

              setTextValue(value);
              setConfig(parse(value));
            }}
            value={textValue}
          />
        </p>
      </div>
    </div>
  );
}

export default App;
