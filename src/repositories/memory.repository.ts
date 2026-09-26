import { randomUUID } from "node:crypto";

// Repositório genérico em memória: guarda os dados enquanto o servidor estiver rodando.
export class MemoryRepository<T extends { id: string }> {
  private items: T[] = [];

  findAll(): T[] {
    return this.items;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(data: Omit<T, "id">): T {
    const item = { id: randomUUID(), ...data } as T;
    this.items.push(item);
    return item;
  }

  update(id: string, data: Omit<T, "id">): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    this.items[index] = { id, ...data } as T;
    return this.items[index];
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
