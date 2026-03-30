import { Request, Response } from 'express';
import { BlockService } from '../services/block.service';

const blockService = new BlockService();

export class BlockController {
  static async getAllBlocks(req: Request, res: Response) {
    try {
      const blocks = await blockService.getAllBlocks();
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blocks' });
    }
  }

  static async getBlockById(req: Request, res: Response) {
    try {
      const block = await blockService.getBlockById(req.params.id as string);
      if (!block) return res.status(404).json({ error: 'Block not found' });
      res.json(block);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createBlock(req: Request, res: Response) {
    try {
      const block = await blockService.createBlock(req.body);
      res.status(201).json(block);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create block' });
    }
  }

  static async updateBlock(req: Request, res: Response) {
    try {
      const block = await blockService.updateBlock(req.params.id as string, req.body);
      res.json(block);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async publishBlock(req: Request, res: Response) {
    const { force } = req.body;
    try {
      const block = await blockService.publishBlock(req.params.id as string, Boolean(force));
      res.json(block);
    } catch (error: any) {
      res.status(409).json({ error: error.message });
    }
  }

  static async deleteBlock(req: Request, res: Response) {
    try {
      await blockService.deleteBlock(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
