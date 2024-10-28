import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IndicatorSettings {
  movingAverages: {
    smaEnabled: boolean;
    smaPeriods: number[];
    emaEnabled: boolean;
    emaPeriods: number[];
  };
  rsi: {
    enabled: boolean;
    period: number;
    overbought: number;
    oversold: number;
  };
  macd: {
    enabled: boolean;
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
  };
  bollingerBands: {
    enabled: boolean;
    period: number;
    standardDeviations: number;
  };
  volume: {
    enabled: boolean;
    mavPeriod: number;
  };
}

interface SettingsState {
  indicators: IndicatorSettings;
}

const initialState: SettingsState = {
  indicators: {
    movingAverages: {
      smaEnabled: true,
      smaPeriods: [20, 50, 200],
      emaEnabled: true,
      emaPeriods: [12, 26],
    },
    rsi: {
      enabled: true,
      period: 14,
      overbought: 70,
      oversold: 30,
    },
    macd: {
      enabled: true,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    bollingerBands: {
      enabled: true,
      period: 20,
      standardDeviations: 2,
    },
    volume: {
      enabled: true,
      mavPeriod: 20,
    },
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateIndicatorSettings: (state, action: PayloadAction<IndicatorSettings>) => {
      state.indicators = action.payload;
    },
    updateMovingAverages: (
      state,
      action: PayloadAction<Partial<IndicatorSettings['movingAverages']>>
    ) => {
      state.indicators.movingAverages = {
        ...state.indicators.movingAverages,
        ...action.payload,
      };
    },
    updateRSI: (
      state,
      action: PayloadAction<Partial<IndicatorSettings['rsi']>>
    ) => {
      state.indicators.rsi = {
        ...state.indicators.rsi,
        ...action.payload,
      };
    },
    updateMACD: (
      state,
      action: PayloadAction<Partial<IndicatorSettings['macd']>>
    ) => {
      state.indicators.macd = {
        ...state.indicators.macd,
        ...action.payload,
      };
    },
    updateBollingerBands: (
      state,
      action: PayloadAction<Partial<IndicatorSettings['bollingerBands']>>
    ) => {
      state.indicators.bollingerBands = {
        ...state.indicators.bollingerBands,
        ...action.payload,
      };
    },
    updateVolume: (
      state,
      action: PayloadAction<Partial<IndicatorSettings['volume']>>
    ) => {
      state.indicators.volume = {
        ...state.indicators.volume,
        ...action.payload,
      };
    },
  },
});

export const {
  updateIndicatorSettings,
  updateMovingAverages,
  updateRSI,
  updateMACD,
  updateBollingerBands,
  updateVolume,
} = settingsSlice.actions;

export default settingsSlice.reducer;