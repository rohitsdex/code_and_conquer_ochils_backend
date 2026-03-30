import { Router } from 'express';
import { BlockController } from '../controllers/block.controller';

const router = Router();

router.get('/', BlockController.getAllBlocks);
router.get('/:id', BlockController.getBlockById);
router.post('/', BlockController.createBlock);
router.put('/:id', BlockController.updateBlock);
router.post('/:id/publish', BlockController.publishBlock);
router.delete('/:id', BlockController.deleteBlock);

export default router;
