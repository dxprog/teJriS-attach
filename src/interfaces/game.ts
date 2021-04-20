export interface IGameObject {
  update: (delta: number) => void;
  draw: () => void;
}
