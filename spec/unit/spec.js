
describe 'Coppersplit'
    describe 'Data gathering'

        it 'should accept straight data'
            coppersplit = new Coppersplit({
                total: 4237,
                members: 24,
                mods: [{name: 'Agustina', mods: '-17'}]
            });
            coppersplit.gather();
            
            coppersplit.total.should_eql(4237)
            coppersplit.members.should_eql(24)
            coppersplit.mods.should_eql([{name: 'Agustina', mods: '-17'}])
        end
        
        it "should accept element references"
            fields = element(fixture("form")).getChildren();
            coppersplit = new Coppersplit({
                total: fields.shift().getLast(),
                mods: fields.shift().getLast(),
                members: fields.shift().getLast(),
            });
            
            coppersplit.gather();
            
            coppersplit.total.should_eql(1432.5)
            coppersplit.members.should_eql(24)
            coppersplit.mods.should_eql([{name: 'Agustina', mods: '-15 -2 -8 -12'}])
        end
    end
end