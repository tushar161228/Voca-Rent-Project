const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, 
             // required: true,
             // unique: true 
            },
    password: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['owner','admin','tenant'], default: 'owner' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
      otp: [{
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
    
  }],
  subscription:{
    plan:{type:mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan'},
    planName:{type:String},
    amount:{type:Number},
    isActive:{type:Boolean, default:false},
    startDate:{type:Date},
    endDate:{type:Date}
  },
    // subscriptionTier: { type: String, enum: ['basic', 'standard', 'premium', 'enterprise'], default: 'basic' },
    // subscriptionExpiry: { type: Date }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
