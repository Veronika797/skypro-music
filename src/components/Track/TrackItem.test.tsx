import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrackItem } from './TrackItem';
import { TypesTrack } from '@/SharedTypes/SharedTypes';
import { useLikeTrack } from '@/hooks/useLikeTracks';
import { useAppSelector } from '@/store/store';

jest.mock('@/store/store', () => ({
  useAppSelector: jest.fn((selector) =>
    selector({ auth: { access: 'mock-token' } }),
  ),
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppStore: jest.fn(),
}));

jest.mock('@/hooks/useLikeTracks');
const mockUseLikeTrack = useLikeTrack as jest.MockedFunction<
  typeof useLikeTrack
>;

const mockTrack: TypesTrack = {
  _id: '1',
  name: 'Тестовый трек',
  author: 'Тестовый автор',
  release_date: '2021-01-01',
  genre: ['Рок'],
  duration: 180,
  duration_in_seconds: 180,
  album: 'Тестовый альбом',
  logo: null,
  track_file: 'test.mp3',
  stared_user: [],
};

describe('Компонент TrackItem', () => {
  const defaultProps = {
    track: mockTrack,
    isActive: false,
    isPlaying: false,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { access: 'mock-token' } }),
    );
    mockUseLikeTrack.mockReturnValue({
      isLike: false,
      toggleLike: jest.fn(),
      isLoading: false,
      errorMsg: null,
    });
  });

  describe('Рендеринг', () => {
    it('должен отображать название трека', () => {
      render(<TrackItem {...defaultProps} />);
      expect(screen.getByText('Тестовый трек')).toBeInTheDocument();
    });

    it('должен отображать автора трека', () => {
      render(<TrackItem {...defaultProps} />);
      expect(screen.getByText('Тестовый автор')).toBeInTheDocument();
    });

    it('должен отображать альбом трека', () => {
      render(<TrackItem {...defaultProps} />);
      expect(screen.getByText('Тестовый альбом')).toBeInTheDocument();
    });

    it('должен форматировать время трека', () => {
      render(<TrackItem {...defaultProps} />);
      expect(screen.getByText('03:00')).toBeInTheDocument();
    });

    it('должен применять класс active когда isActive = true', () => {
      render(<TrackItem {...defaultProps} isActive={true} />);
      const item = screen.getByText('Тестовый трек').closest('.playlist__item');
      expect(item).toHaveClass('active');
    });
  });

  describe('Лайки', () => {
    it('должен показывать неактивный лайк когда isLike = false', () => {
      render(<TrackItem {...defaultProps} />);
      const likeBtn = screen.getByTestId('like-button');
      expect(likeBtn.querySelector('svg')).not.toHaveClass('liked');
    });

    it('должен показывать активный лайк когда isLike = true', () => {
      mockUseLikeTrack.mockReturnValue({
        isLike: true,
        toggleLike: jest.fn(),
        isLoading: false,
        errorMsg: null,
      });

      render(<TrackItem {...defaultProps} />);
      const likeBtn = screen.getByTestId('like-button');
      expect(likeBtn.querySelector('svg')).toHaveClass('liked');
    });

    it('должен вызывать toggleLike при клике на лайк', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();

      mockUseLikeTrack.mockReturnValue({
        isLike: false,
        toggleLike: mockToggle,
        isLoading: false,
        errorMsg: null,
      });

      render(<TrackItem {...defaultProps} />);
      await user.click(screen.getByTestId('like-button'));

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('должен показывать спиннер когда isLoading = true', () => {
      mockUseLikeTrack.mockReturnValue({
        isLike: false,
        toggleLike: jest.fn(),
        isLoading: true,
        errorMsg: null,
      });

      render(<TrackItem {...defaultProps} />);
      const likeBtn = screen.getByTestId('like-button');
      expect(likeBtn.querySelector('.likeSpinner')).toBeInTheDocument();
    });

    it('должен быть отключён когда нет авторизации', async () => {
      const mockToggleLike = jest.fn();

      mockUseLikeTrack.mockReturnValue({
        isLike: false,
        toggleLike: mockToggleLike,
        isLoading: false,
        errorMsg: 'Войдите в аккаунт',
      });

      (useAppSelector as jest.Mock).mockImplementation((selector) =>
        selector({ auth: { access: null } }),
      );

      render(<TrackItem {...defaultProps} />);
      const likeBtn = screen.getByTestId('like-button');

      expect(likeBtn).toBeDisabled();
      fireEvent.click(likeBtn);
      expect(mockToggleLike).not.toHaveBeenCalled();
    });
  });

  describe('Взаимодействие', () => {
    it('должен вызывать onClick при клике на трек', async () => {
      const user = userEvent.setup();
      render(<TrackItem {...defaultProps} />);

      await user.click(screen.getByText('Тестовый трек'));
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('не должен вызывать onClick при клике на лайк', async () => {
      render(<TrackItem {...defaultProps} />);

      fireEvent.click(screen.getByTestId('like-button'));
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
  });

  describe('Индикатор воспроизведения', () => {
    it('должен показывать иконку ноты когда трек не активен', () => {
      render(<TrackItem {...defaultProps} isActive={false} />);
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('должен показывать индикатор play когда трек активен и играет', () => {
      render(<TrackItem {...defaultProps} isActive={true} isPlaying={true} />);
      const indicator = screen.getByTestId('play-indicator');
      expect(indicator).toHaveClass('playIndicator--playing');
    });

    it('должен показывать индикатор pause когда трек активен но не играет', () => {
      render(<TrackItem {...defaultProps} isActive={true} isPlaying={false} />);
      const indicator = screen.getByTestId('play-indicator');
      expect(indicator).toHaveClass('playIndicator--paused');
    });
  });
});
