import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CellularModel } from '../model/model';
import './App.css';
import { ButtonList } from './base/Button';
import { Icon, IconButton } from './base/Icons';
import { ModelUI } from './model/Model';
import { ModelStore } from '../runtime/store';

function App() {
  const [model, _setModel] = useState<CellularModel>({
    title: "Hello World",
    blocks: []
  });

  const store = useMemo(() => new ModelStore(model), [model]);

  useEffect(() => {
    window.document.title = `${model.title} - Cellular`;
  }, [model]);

  return (
    <div className="app">
        <div className="app-header">
          <div className="app-title">
            CELLULAR <div className="app-title-model">/ {model.title}</div>
          </div>
          <div className="app-nav">
            <ButtonList>
              <IconButton icon="add" text="Add" />
              <IconButton icon="save" />
              <IconButton icon="settings" />
              <IconButton icon="print" onClick={() => window.print()} />
            </ButtonList>

          </div>
        </div>
        <ModelUI store={store} />
    </div>
  );
}

export default App;
