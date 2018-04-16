/**
 * Module exports.
 */

module.exports = PokerManager;

/**
 * PokerManager constructor.
 *
 * @param
 */
function PokerManager(){

}
/**
 * 对比牌型大小
 * @param {上一手牌} lastPoker 
 * @param {当前手牌} thisPoker 
 */
PokerManager.prototype.comparaPoker = function(lastPoker,thisPoker){
    if (lastPoker == thisPoker) {
        return true;
    }
    return false;
}