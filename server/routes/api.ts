import KoaRouter from 'koa-router'
import getUser from '../middleware/getUser'
import botLogin from '../middleware/botLogin'
import AdminCtrl from '../controller/admin'
import RobotCtrl from '../controller/robot'
const router = new KoaRouter()

router.prefix('/api')

router.post('/auth/login', AdminCtrl.login)
router.get('/auth/user', getUser(), AdminCtrl.getUser)
router.post('/auth/logout', AdminCtrl.logout)

router.get('/admin/robot/:id', AdminCtrl.getRobot)
router.post('/admin/robot', getUser(), AdminCtrl.addRobot)
router.put('/admin/robot/:id', AdminCtrl.updateRobot)

router.get('/admin/group', AdminCtrl.getGroups)
router.put('/admin/group/:id', AdminCtrl.updateGroup)

router.get('/admin/friend', AdminCtrl.getFriends)

router.get('/admin/reply', AdminCtrl.getReplys)
router.post('/admin/reply', AdminCtrl.addReply)
router.put('/admin/reply/:id', AdminCtrl.updateReply)
router.post('/admin/reply', AdminCtrl.deleteReply)

router.get('/admin/task', AdminCtrl.getTasks)
router.post('/admin/task', AdminCtrl.addTask)
router.put('/admin/task/:id', AdminCtrl.updateTask)
router.post('/admin/task', AdminCtrl.deleteTask)

router.post('/robot/login', RobotCtrl.login)
router.post('/robot/logout', RobotCtrl.logout)

router.post('/robot/friend/say', botLogin(), RobotCtrl.friendSay)

router.post('/robot/room/say', botLogin(), RobotCtrl.roomSay)
router.get('/robot/room/:id', botLogin(), RobotCtrl.getRoom)
router.put('/robot/room/:id', botLogin(), RobotCtrl.updateRoom)
router.post('/robot/room/quit', botLogin(), RobotCtrl.roomQuit)

export default router
