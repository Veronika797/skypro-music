import {
  formatTime,
  getTimePanel,
  getUniqueValuesByKey,
  getUniqueYears,
} from './helper';
import { TypesTrack } from '@/SharedTypes/SharedTypes';

describe('formatTime', () => {
  it('должна форматировать обычное время', () => {
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(3665)).toBe('61:05');
  });

  it('должна возвращать "00:00" для null и undefined', () => {
    // @ts-expect-error - intentionally testing runtime handling of null values
    expect(formatTime(null)).toBe('00:00');
    // @ts-expect-error - intentionally testing runtime handling of undefined values
    expect(formatTime(undefined)).toBe('00:00');
  });

  it('должна возвращать "00:00" для NaN и Infinity', () => {
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(Infinity)).toBe('00:00');
    expect(formatTime(-Infinity)).toBe('00:00');
  });

  it('должна корректно форматировать 0 и отрицательные значения', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(-10)).toBe('00:-10');
  });

  it('должна добавлять ведущий ноль к секундам < 10', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(65)).toBe('01:05');
  });

  it('должна не добавлять ведущий ноль к секундам >= 10', () => {
    expect(formatTime(70)).toBe('01:10');
    expect(formatTime(120)).toBe('02:00');
  });
});

describe('getTimePanel', () => {
  it('должна возвращать формат "currentTime / duration" когда duration определён', () => {
    expect(getTimePanel({ currentTime: 125, duration: 300 })).toBe(
      '02:05 / 05:00',
    );
  });

  it('должна возвращать только currentTime когда duration не определён', () => {
    expect(getTimePanel({ currentTime: 125, duration: undefined })).toBe(
      '02:05',
    );
  });

  it('должна корректно обрабатывать 0 для currentTime', () => {
    expect(getTimePanel({ currentTime: 0, duration: 180 })).toBe(
      '00:00 / 03:00',
    );
  });

  it('должна использовать formatTime для обоих значений', () => {
    expect(getTimePanel({ currentTime: 5, duration: 65 })).toBe(
      '00:05 / 01:05',
    );
  });
});

describe('getUniqueValuesByKey', () => {
  it('должна возвращать пустой массив для undefined', () => {
    expect(
      getUniqueValuesByKey(undefined as unknown as TypesTrack[], 'author'),
    ).toEqual([]);
  });

  it('должна возвращать пустой массив для пустого массива', () => {
    expect(
      getUniqueValuesByKey([] as unknown as TypesTrack[], 'author'),
    ).toEqual([]);
  });

  it('должна возвращать уникальные примитивные значения', () => {
    const tracks = [
      { author: 'Автор 1' },
      { author: 'Автор 2' },
      { author: 'Автор 1' },
    ] as unknown as TypesTrack[];

    expect(getUniqueValuesByKey(tracks, 'author')).toEqual([
      'Автор 1',
      'Автор 2',
    ]);
  });

  it('должна работать с массивами значений (genre: string[])', () => {
    const tracks = [
      { genre: ['Рок', 'Поп'] },
      { genre: ['Поп', 'Джаз'] },
      { genre: ['Рок'] },
    ] as unknown as TypesTrack[];

    const result = getUniqueValuesByKey(tracks, 'genre');
    expect(result).toHaveLength(3);
    expect(result).toContain('Рок');
    expect(result).toContain('Поп');
    expect(result).toContain('Джаз');
  });

  it('должна сохранять порядок первого вхождения', () => {
    const tracks = [
      { author: 'B' },
      { author: 'A' },
      { author: 'B' },
      { author: 'C' },
    ] as unknown as TypesTrack[];

    expect(getUniqueValuesByKey(tracks, 'author')).toEqual(['B', 'A', 'C']);
  });

  it('должна корректно обрабатывать пустые строки и значения', () => {
    const tracks = [
      { author: '' },
      { author: 'Автор' },
      { author: '' },
    ] as unknown as TypesTrack[];

    expect(getUniqueValuesByKey(tracks, 'author')).toEqual(['', 'Автор']);
  });

  it('должна работать с числовыми ключами (_id)', () => {
    const tracks = [
      { _id: 1 },
      { _id: 2 },
      { _id: 1 },
      { _id: '3' },
    ] as unknown as TypesTrack[];

    expect(getUniqueValuesByKey(tracks, '_id')).toEqual([1, 2, '3']);
  });
});

describe('getUniqueYears', () => {
  it('должна возвращать пустой массив для undefined', () => {
    expect(getUniqueYears(undefined as unknown as TypesTrack[])).toEqual([]);
  });

  it('должна возвращать пустой массив для пустого массива', () => {
    expect(getUniqueYears([] as unknown as TypesTrack[])).toEqual([]);
  });

  it('должна извлекать года из валидных дат', () => {
    const tracks = [
      { release_date: '2020-01-01' },
      { release_date: '2019-06-15' },
      { release_date: '2020-12-31' },
    ] as unknown as TypesTrack[];

    expect(getUniqueYears(tracks)).toEqual([2020, 2019]);
  });

  it('должна сортировать года по убыванию', () => {
    const tracks = [
      { release_date: '2018-01-01' },
      { release_date: '2022-01-01' },
      { release_date: '2020-01-01' },
    ] as unknown as TypesTrack[];

    expect(getUniqueYears(tracks)).toEqual([2022, 2020, 2018]);
  });

  it('должна игнорировать невалидные даты', () => {
    const tracks = [
      { release_date: '2020-01-01' },
      { release_date: 'invalid' },
      { release_date: '' },
      { release_date: 'not-a-date' },
    ] as unknown as TypesTrack[];

    expect(getUniqueYears(tracks)).toEqual([2020]);
  });

  it('должна удалять дубликаты годов', () => {
    const tracks = [
      { release_date: '2020-01-01' },
      { release_date: '2020-06-01' },
      { release_date: '2020-12-01' },
    ] as unknown as TypesTrack[];

    expect(getUniqueYears(tracks)).toEqual([2020]);
  });

  it('должна корректно обрабатывать даты с разным форматом', () => {
    const tracks = [
      { release_date: '2020' },
      { release_date: '2020-01' },
      { release_date: '2020-01-01T00:00:00Z' },
    ] as unknown as TypesTrack[];

    expect(getUniqueYears(tracks)).toEqual([2020]);
  });
});
